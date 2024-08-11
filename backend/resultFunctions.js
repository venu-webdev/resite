const { default: mongoose } = require("mongoose")
const { resultsModel, resultSetModel } = require("./resultsModel")

const addResults = async (results) => {

    const setId = new mongoose.Types.ObjectId().toString()
    results['resultSetId'] = setId

    await resultsModel.create(results).then(async () => {

        await resultSetModel.create({ resultTitle: results['resultTitle'], resultSetId: results['resultSetId'], resultDate: results['uploadDate'] }).then(() => {
            console.log("Result Set Added & Results Added")
        }).catch((err) => {
            console.log("Results added successfully & Err in adding result set: ", err)
        })

    }).catch((err) => [

        console.log("Err in adding results: ", err)

    ])

}

const getResultSets = async () => {
    return (await resultSetModel.find()).reverse()
}

const getResultSet = async (resultSetId) => {
    return await resultsModel.find({ resultSetId })
}

const getResult = async ({ resultSetId, regNo }) => {

    const resultSet = await getResultSet(resultSetId)

}

module.exports = {
    addResults, getResultSets, getResult, getResultSet
}