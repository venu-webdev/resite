//db.js

const mongoose = require('mongoose');

const { default: dotenv } = require('./dotenv');
const { getResult } = require('./resultFunctions');

const url = process.env.DB_URL;

const connectDb = () => {
    mongoose.connect(url)
        .then(async () => {
            console.log('Connected to the database ')

            //get Result Sets
            // const resultSets = await getResultSets()
            // console.log("resultSets: ", resultSets, resultSets.length)

            //get Result by setId
            // await getResult({ resultSetId: '666d54d8a1cdf9a2baf51c46', regNo: '218p1A0566' })
        })
        .catch((err) => {
            console.error(`Error connecting to the database. n${err}`);
        })
}

// createUser({ username: 'siv', email: 'siv@gmail.com', password: 'siv', role: 'admin' })
// addResults({
//     Sheet1: [
//         {
//             'Reg No': '218P1A0566',
//             Name: 'PELLAM REDDI NAGA LAKSHMI',
//             TOTAL: 170,
//             '%': 94.44,
//             marks: [23, 24, 25, 28, 30, 29]
//         },
//         {
//             'Reg No': '218P1A0567',
//             Name: 'RAGINENI NAGA SRI',
//             TOTAL: 150,
//             '%': 83.33,
//             marks: [23, 24, 25, 28, 30, 29]
//         },
//         {
//             'Reg No': '218P1A0568',
//             Name: 'VALLEPU NANDINI',
//             TOTAL: 152,
//             '%': 84.44,
//             marks: [23, 24, 25, 28, 30, 29]
//         },
//         {
//             'Reg No': '218P1A0569',
//             Name: 'BADUGU NANDINI',
//             TOTAL: 161,
//             '%': 89.44,
//             marks: [22, 23, 25, 28, 29, 30]
//         },
//         {
//             'Reg No': '218P1A0570',
//             Name: 'AFGHAN NASEER KHAN',
//             TOTAL: 161,
//             '%': 89.44,
//             marks: [22, 23, 25, 28, 29, 30]
//         },
//         {
//             'Reg No': '218P1A0571',
//             Name: 'BUSIREDDY NEERAJA REDDY',
//             TOTAL: 153,
//             '%': 85,
//             marks: [22, 23, 25, 28, 29, 30]
//         }
//     ],
//     resultSetId: new mongoose.Types.ObjectId().toString(),
//     resultTitle: '4-2 ECE MID-I',
//     subjects: ['CD', 'ML', 'IOT', 'B-VLSI', 'ST', 'IPR&P'],
//     uploadDate: new Date()
// })


module.exports = {
    connectDb
}