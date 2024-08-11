const { userModel } = require("./userModel")

const createUser = async ({ username, email, password, role }) => {

    return userModel.create({
        username,
        email,
        password,
        role
    })

}

const getAllUsers = async () => {
    return await userModel.find()
}

const getUser = async (key) => {
    console.log("key: ", key)
    return await userModel.find({ email: key })
}

module.exports = {
    createUser, getAllUsers, getUser
}