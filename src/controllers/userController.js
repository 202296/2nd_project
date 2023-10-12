const User = require('../models/authModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');


const createUser = asyncHandler(async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        // Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser)
    } else {
        // User already exists
        throw new Error('User Already Exists');
    }
});

// Get all user

const getallUser = asyncHandler(async(req, res) =>{
 try {
    const getUsers = await User.find();
    res.json(getUsers);
    }
  catch (error) {
        throw new Error(error)
    }
});

// Get a single user

const getaUser = asyncHandler(async(req, res) => {
        const {id} = req.params;
        validateMongodbId(id)
        try {
            const getaUser = await User.findById(id);
            res.json({
                getaUser,
            })
        } catch (error) {
            throw new Error(error);
        }
});


module.exports = {
    createUser, 
    getallUser, 
    getaUser, 
}