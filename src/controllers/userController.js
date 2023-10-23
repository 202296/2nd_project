const { generateToken } = require('../configs/jwtoken');
const User = require('../models/authModel');
const Product = require("../models/prodModel");
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../configs/refreshToken');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        // Create a new user
        const newUser = await User.create(req.body);
        res.status(201).json({ acknowledged:true, insertedId: newUser.id });
    } else {
        // User already exists
        return res.status(400).json({ error: 'User Already Exists' });
    }
});


const loginUserCtrl = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    // check if user exist or not
    const findUser = await User.findOne({email})
    if(findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const Updateuser = await User.findByIdAndUpdate(
        findUser.id, 
        {
            refreshToken: refreshToken,
        }, 
        {
            new: true,
        }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            dateOfBirth: findUser?.dateOfBirth,
            department: findUser?.department,
            salary: findUser?.salary,
            email: findUser?.email,
            hireDate: findUser?.hireDate,
            jobTitle: findUser?.jobTitle,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        return res.status(400).json({ error: 'Invalid Credentials' });
    }
});

const loginAdmin = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    // check if user exist or not
    const findAdmin = await User.findOne({email})
    if(findAdmin.role !== 'admin') return res.status(400).json({ error: 'Not Authorized' });
    if(findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const UpdateAdmin = await User.findByIdAndUpdate(
        findAdmin.id, 
        {
            refreshToken: refreshToken,
        }, 
        {
            new: true,
        }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            dateOfBirth: findAdmin?.dateOfBirth,
            department: findAdmin?.department,
            salary: findAdmin?.salary,
            email: findAdmin?.email,
            hireDate: findAdmin?.hireDate,
            jobTitle: findAdmin?.jobTitle,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        return res.status(400).json({ error: 'Invalid Credentials' });
    }
});


// Get all user

const getallUser = asyncHandler(async(req, res) =>{
 try {
    const getUsers = await User.find();
    res.json(getUsers);
    }
  catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
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
            return res.status(500).json({ error: 'Internal server error' });
        }
});

const UpdateaUser = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id)
    try {
        const UpdateaUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            dateOfBirth: req?.body?.dateOfBirth,
            department: req?.body?.department,
            salary: req?.body?.salary,
            email: req?.body?.email,
            hireDate: req?.body?.hireDate,
            jobTitle: req?.body?.jobTitle,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        }
        );
        res.status(204).json(UpdateaUser)
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error('No Refresh token present in db or not matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token.')
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken});
    })   
});


// Logout Functionality

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    console.log(cookie)
    if (!cookie?.refreshToken) {
      throw new Error('No Refresh Token in Cookies');
    }
  
    const refreshToken = cookie.refreshToken;
  
    const user = await User.findOne({ refreshToken });
  
    if (!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // No Content
    }
  
    await User.findOneAndUpdate(
      { refreshToken: refreshToken }, // Corrected filter
      { refreshToken: '' },          // Update data
      { new: true }                  // Options, if needed
    );
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // No Content
  });


const deleteaUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbId(id)
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        if (!deleteaUser) {
            return res.status(400).json({ error: 'Contact not found' });
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    createUser, 
    loginUserCtrl,
    loginAdmin,
    getallUser, 
    getaUser, 
    UpdateaUser,
    handleRefreshToken,
    logout,
    deleteaUser
}