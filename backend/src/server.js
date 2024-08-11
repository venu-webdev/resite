const express = require('express');
const cookieParser = require('cookie-parser');
// const session = require('express-session')
// const store = new session.MemoryStore();
const cors = require('cors');
const bodyParser = require('body-parser')

const multer = require("multer")
const excelToJson = require("convert-excel-to-json")
const fs = require("fs-extra")
let upload = multer({ dest: "uploads/" })

const { default: dotenv } = require('../dotenv');

const jwt = require('jsonwebtoken');
const { connectDb } = require('../db');
const { userModel } = require('../userModel');
const { getUser, createUser, getAllUsers } = require('../userFunctions');
const { getResultSets, getResult, getResultSet, addResults } = require('../resultFunctions');

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const PORT = process.env.PORT

const app = express()
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

const roles = ['super', 'admin', 'user']
app.use((req, res, next) => {
    // console.log("store:", store)
    console.log(req.method, req.url);
    next()
})
//to capitalize the usernames

const capitalize = (string) => {

    return ((string.trim()).split(" ")).map((str) => {
        return str[0].toUpperCase() + str.slice(1)
    }).join(" ")

}

connectDb()

// let users = [
//     {
//         id: 0,
//         username: 'super',
//         email: 'venu@gmail.com',
//         password: 'venu@gmail.com',
//         role: 'super'
//     },
//     {
//         id: 1,
//         username: 'harun',
//         email: 'harun@gmail.com',
//         password: 'harun@gmail.com',
//         role: 'admin'
//     },
//     {
//         id: 2,
//         username: 'Charan',
//         email: 'charan@gmail.com',
//         password: 'charan@gmail.com',
//         role: 'admin'
//     },

//     {
//         id: 3,
//         username: 'Ramesh',
//         email: 'ramesh@gmail.com',
//         password: 'ramesh@gmail.com',
//         role: 'user'
//     },
//     {
//         id: 4,
//         username: 'Raani',
//         email: 'rani@gmail.com',
//         password: 'rani@gmail.com',
//         role: 'user'
//     }
// ]



//generate New Access Token

const generateAccessToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "10m" });
}

let refreshTokens = []

const currTokens = {
    accessToken: '',
    refreshToken: '',
}

let accessTokenHolder = ""

//generate New Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(user, JWT_REFRESH_SECRET)
}

//to register 
app.post('/api/register', async (req, res) => {

    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json("Enter all the required fields");
    }

    email = email.toLowerCase()
    username = capitalize(username)

    const userCheck = await getUser(email)
    console.log("userCheck: ", userCheck)

    if (!userCheck.length) {

        const role = 'user'

        //generate the accessToken
        let accessToken = generateAccessToken({ username, email, role });
        let refreshToken = generateRefreshToken({ username, email, role });

        console.log("accessToken: ", accessToken)

        return await createUser({ username, email, password, role }).then(() => {

            accessTokenHolder = accessToken
            refreshTokens.push(refreshToken)


            console.log("user registered successfully")

            return res.status(200).json({
                msg: "User Registered Successfully",
                accessToken: accessTokenHolder,
                refreshToken: refreshToken
            })

        }).catch((err) => {
            console.log("Err in registering user: ", err)
            return res.json(
                { msg: 'Err in registering the user' }
            )
        })


    } else if (userCheck[0].email === email) {

        return res.status(200).json({
            msg: "User Already Exists, please Login"
        })

    }

    return res.status(200).json({ msg: "Something went wrong" })
})

//to login 
app.post('/api/login', async (req, res) => {

    let { email, password } = req.body;
    email = email?.toLowerCase()


    if (!email || !password) {
        return res.status(200).json({ msg: "Enter all the required fields" });
    }

    const checkUser = await getUser(email)
    console.log("check user: ", checkUser)

    if (!checkUser.length) {

        return res.status(200).json({ msg: "User not found in the Database, please Register" })

    } else if (checkUser[0].email === email && checkUser[0].password === password) {

        let role = checkUser[0].role
        let username = checkUser[0].username

        let accessToken = generateAccessToken({ username, email, role });
        let refreshToken = generateRefreshToken({ username, email, role });

        accessTokenHolder = accessToken
        refreshTokens.push(refreshToken)

        return res.status(200).json({
            msg: "User Logged Successfully",
            accessToken: accessTokenHolder,
            refreshToken: refreshToken
        })

    }
    return res.status(200).json({ msg: "Invalid Email and Password" })
})


//verify token
const verifyToken = (req, res, next) => {
    console.log(req)
    let token = req.header("Authorization");
    console.log("token provided from frontend: ", token)
    if (token) {
        token = token.split(" ")[1];
        console.log("")
        if (token) {

            const user = jwt.verify(token, JWT_SECRET, (err, user) => {

                if (err) {
                    console.log("in err block", err)
                    return "Token Expired"
                }

                req.user = user
                next()
            })
            if (user === "Token Expired") {
                return res.json({ msg: "Token Expired" })
            }

        } else {

            return res.status(200).json({ msg: "Unauthorized Access" });

        }

    } else {

        return res.status(200).json({ msg: "You are not authenticated" });

    }
}

const verifyNonNormalUser = (req, res, next) => {
    console.log("req.user.role", req.user.role)
    if (req.user.role !== 'user') {
        next()
    } else {
        return res.status(200).json({ msg: "You are not an authorised user" })
    }
}

const verifySuper = (req, res, next) => {
    console.log("req.user.role", req.user.role)
    if (req.user.role === 'super') {
        next()
    } else {
        return res.status(200).json({ msg: "You are not a super user" })
    }
}

app.post('/api/refresh', (req, res) => {

    let curRefreshToken = req.body.token
    console.log("token in refresh: ", req.body.token)
    if (!curRefreshToken) return res.status(200).json({ msg: "in refresh You are not Authenticated" })

    // if (!refreshTokens.includes(curRefreshToken)) return res.status(200).json({ msg: "Refresh Token is invalid" })

    jwt.verify(curRefreshToken, JWT_REFRESH_SECRET, (err, user) => {

        if (err) return console.log(err)

        let { username, email, role } = user

        console.log("user: in refresh: ", user)

        refreshTokens = refreshTokens.filter((token) => token !== curRefreshToken)

        let accessToken = generateAccessToken({ username, email, role })
        let refreshToken = generateRefreshToken({ username, email, role })

        accessTokenHolder = accessToken
        refreshTokens.push(refreshToken)

        res.status(200)

        return res.json({
            msg: "refresh token generation successful",
            refreshToken,
            accessToken
        })


    })
})

let resultsData = []
let resultSets = []
// app.post('/api/results', verifyToken, verifyNonNormalUser, (req, res) => {
//     console.log("req:", req.body, req.files)
//     return res.json("details sent")
// })
app.post('/api/results', verifyToken, verifyNonNormalUser, upload.single("file"), async (req, res) => {

    try {

        console.log("req.files: ", req.file)
        let { title, subjects } = req.body
        console.log("title: ", title)
        console.log("subjects: ", subjects)
        subjects = subjects.split(',')
        console.log("subjects: ", subjects)
        if (req.file?.filename == null || req.file?.filename == "undefined") {
            res.status(400).json("No file")
        } else {
            var filePath = "uploads/" + req.file.filename;
            let date = new Date()
            const month = date.toLocaleString('en-US', { month: 'short' })
            const day = ('' + date.getDate()).padStart(2, '0')
            const year = date.getFullYear()
            const formatedDate = `${day}-${month}-${year}`
            console.log("date: ", date, month, day, year)
            console.log("subjects: ", subjects)
            const excelData = excelToJson({
                sourceFile: filePath,
                header: {
                    rows: 1,
                },
                columnToKey: {
                    "*": "{{columnHeader}}",
                },
            })
            console.log('after excel data decl');

            excelData['resultTitle'] = title
            console.log('after excel data decl');
            // excelData['resultSetId'] = resultsData.length
            excelData['subjects'] = subjects
            console.log('after excel data decl');
            excelData['uploadDate'] = formatedDate
            console.log('after excel data decl');

            excelData['Sheet1'].forEach((result) => {
                result['marks'] = []
                excelData['subjects'].forEach((subject) => {
                    result['marks'].push(result[subject])
                    delete result['S.No']
                    delete result[subject]
                })
            })
            console.log('after excel data decl');

            // resultsData[0]['Sheet1'].find((stu) => stu['ROLL NO'] === '218P1A05D2')

            // let resultSetsItem = {
            //     resultTitle: title,
            //     resultId: resultsData.length,
            //     resultDate: formatedDate,
            // }

            // console.log("check 1")
            // resultSets.push(resultSetsItem)
            // console.log("check 2")

            // excelData['Max Marks'] = maxMarks
            // excelData['Sheet1'].forEach((result) => {
            //     let total = 0
            //     subjects.forEach((subject) => {
            //         total += result[subject]
            //     })
            //     result['TOTAL'] = total

            //     result['PERCENTAGE'] = Math.round((((total / parseInt(maxMarks)) * 100) + Number.EPSILON) * 100) / 100
            // })
            // console.log("check 3")
            // resultsData.push(excelData)
            console.log("excelData: ", excelData)
            return await addResults(excelData).then(() => {

                fs.remove(filePath);
                return res.status(200).json({ msg: 'results uploaded successfully' })

            }).catch((err) => {
                console.log("Err in uploading results: ", err)
            })
        }

    } catch (err) {
        return res.status(500).json(err)
    }

})

app.get('/api/results', async (req, res) => {
    console.log("in this 0")
    const resultSets = await getResultSets()
    if (resultSets.length) {
        console.log("in this 1")
        return res.json(resultSets)
    } else {
        console.log("in this 2")
        return res.json({ msg: 'No Results Found' })
    }
})

app.post('/api/result/:resultSetId', async (req, res) => {
    let { regNo } = req.body;
    let resultSetId = req.params.resultSetId

    console.log("in this", regNo, req.params.resultSetId)

    if (!regNo) return res.json({ msg: "Enter the regNo" })

    regNo = regNo?.toUpperCase()

    const resultSet = await getResultSet(resultSetId)

    if (resultSet.length) {
        const results = resultSet[0]['Sheet1']
        console.log("results: ", results)

        const foundResult = results.find((result) => {
            return result['Reg No'] === regNo
        })

        if (foundResult !== undefined) {
            console.log('foundResult: ', foundResult, regNo)
            return res.json({ result: foundResult, subjects: resultSet[0]['subjects'] })
        }
    }

    return res.json("No results found")
})

app.get('/api/users', verifyToken, async (req, res) => {

    const users = await getAllUsers()
    return res.status(200).json({ msg: "Token Working", users })

})

app.post("/api/user/create", verifyToken, verifySuper, (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ msg: "Enter valid fields" })
    }
    if (!roles.includes(role)) {
        return res.status(400).json(`'${role}' is not a valid role`)
    }

    if (role === 'super') {
        return res.status(400).json('Super user can only be one')
    }

    const result = users.find(user => user.email === email);
    console.log("result user: ", result)

    if (!result) {
        users.push({
            id: users.length,
            user: email,
            email,
            password,
            role
        })
    } else {
        return res.status(400).json({ msg: "Can't create the user, user already exists" })
    }

    console.log("users: ", users)
    return res.status(200).json({ users, msg: "created the user" })
})

app.post("/api/user/delete", verifyToken, verifySuper, (req, res) => {

    const { email } = req.body;
    console.log("email: ", email, req.body);
    if (!email) {
        return res.status(400).json({ msg: "Enter valid email" })
    }

    const result = users.find(user => user.email === email);
    console.log("result user: ", result)

    if (result && result.role !== 'super') {

        users = users.filter((user) => user.email !== email)

    } else if (!result) {

        return res.status(400).json({ msg: "User doesn't exist" })

    } else if (result && result.role === 'super') {

        return res.status(400).json({ msg: "User Super can't be deleted" })

    }

    console.log("users: ", users)
    return res.status(200).json({ users, msg: "user deleted successfully" })
})

app.patch("/api/user/edit", verifyToken, verifySuper, (req, res) => {

    const { email, password } = req.body;
    console.log("email: ", email, req.body);
    if (!email || !password) {
        return res.status(400).json({ msg: "Enter valid credentials" })
    }

    const result = users.find(user => {
        if (user.email === email) {
            user.password = password
            return true
        }
        return false
    });
    console.log("result user: ", result)

    if (result) {

        return res.status(200).json({ users, msg: "user details updated" })

    }
    return res.status(400).json({ msg: "User doesn't exist" })
})

app.post("/api/logout", verifyToken, (req, res) => {

    const refreshToken = req.body.token;

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    accessTokenHolder = ""
    return res.status(200).json({ msg: "Successfully Logged Out" })
})

app.listen(PORT, () => console.log("Backend running on port ", PORT))