const express = require('express');
const cookieParser = require('cookie-parser');
// const session = require('express-session')
// const store = new session.MemoryStore();
const cors = require('cors');
const bodyParser = require('body-parser')

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const jwt = require('jsonwebtoken');

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

let users = [
    {
        id: 0,
        username: 'super',
        email: 'venu@gmail.com',
        password: 'venu@gmail.com',
        role: 'super'
    },
    {
        id: 1,
        username: 'harun',
        email: 'harun@gmail.com',
        password: 'harun@gmail.com',
        role: 'admin'
    },
    {
        id: 2,
        username: 'Charan',
        email: 'charan@gmail.com',
        password: 'charan@gmail.com',
        role: 'admin'
    },

    {
        id: 3,
        username: 'Ramesh',
        email: 'ramesh@gmail.com',
        password: 'ramesh@gmail.com',
        role: 'user'
    },
    {
        id: 4,
        username: 'Raani',
        email: 'rani@gmail.com',
        password: 'rani@gmail.com',
        role: 'user'
    }
]



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
// console.log("refresh tokens are: ______________________", refreshTokens)
// console.log("refresh tokens are: ______________________")
//register route
app.post('/api/register', (req, res) => {

    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json("Enter all the required fields");
    }

    email = email.toLowerCase()
    username = capitalize(username)

    const result = users.find(user => user.email === email);
    console.log("result user: ", result)

    if (!result) {

        const role = 'user'

        //generate the accessToken
        let accessToken = generateAccessToken({ username, email, role });
        let refreshToken = generateRefreshToken({ username, email, role });

        console.log("accessToken: ", accessToken)

        users.push({
            id: users.length,
            username,
            email,
            password,
            role
        })

        accessTokenHolder = accessToken
        refreshTokens.push(refreshToken)

        res.status(200)

        return res.json({
            msg: "User Registered Successfully",
            accessToken: accessTokenHolder,
            refreshToken: refreshToken
        })

    } else if (result.email === email) {

        return res.status(200).json({
            msg: "User Already Exists, please Login"
        })

    }

    return res.status(200).json({ msg: "Something went wrong" })
})

//login router
app.post('/api/login', (req, res) => {

    let { email, password } = req.body;
    email = email.toLowerCase()

    // console.log("sessionid: ",req.sessionID);

    if (!email || !password) {
        return res.status(200).json({ msg: "Enter all the required fields" });
    }

    const result = users.find(user => user.email === email);
    console.log("result user: ", result)

    if (!result) {

        return res.status(200).json({ msg: "User not found in the Database, please Register" })

    } else if (result.email === email && result.password === password) {

        let role = result.role
        let username = result.username

        let accessToken = generateAccessToken({ username, email, role });
        let refreshToken = generateRefreshToken({ username, email, role });

        accessTokenHolder = accessToken
        refreshTokens.push(refreshToken)

        res.status(200)

        return res.json({
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
                return res.json({ status: "error", msg: "Token Expired" })
            }

        } else {

            return res.status(200).json({ msg: "Unauthorized Access" });

        }

    } else {

        return res.status(200).json({ msg: "You are not authenticated" });

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

app.get('/api/users', verifyToken, (req, res) => {

    // users.forEach((user)=>{
    //     console.log("user_email: ",user.email)
    // })
    console.log("Do some function______")


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