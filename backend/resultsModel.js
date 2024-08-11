const { default: mongoose } = require("mongoose");

const stringRequired = {
    type: String,
    required: true
}

const resultsSchema = mongoose.Schema(
    {
        resultTitle: stringRequired,
        resultSetId: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        subjects: {
            type: Array,
            required: true,
        },
        uploadDate: String,
        Sheet1: Array
    }
)

const resultSetSchema = mongoose.Schema({
    resultTitle: stringRequired,
    resultSetId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    resultDate: String
})

const resultsModel = mongoose.model('results', resultsSchema)
const resultSetModel = mongoose.model('resultSet', resultSetSchema)

module.exports = {
    resultSetModel, resultsModel
}