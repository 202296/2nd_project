const User = require('../models/authModel');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateToken } = require('../configs/jwToken');

const createUser = async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        // Create a new user
        const newUser = await User.create(req.body);
        res.status(201).json({ acknowledged:true, insertedId: newUser.id });
    } else {
        // User already exists
        throw new Error('User Already Exists');
    }
};


const loginUserCtrl = async(req, res) =>{
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
        throw new Error('Invalid Credentials');
    }
};

const loginAdmin = async(req, res) =>{
    const {email, password} = req.body;
    // check if user exist or not
    const findAdmin = await User.findOne({email})
    if(findAdmin.role !== 'admin') throw new Error('Not Authorised');
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
        throw new Error('Invalid Credentials');
    }
};

// Get all user

const getallUser = async(req, res) =>{
 try {
    const getUsers = await User.find();
    res.json(getUsers);
    }
  catch (error) {
        throw new Error(error)
    }
};

// Get a single user

const getaUser = async(req, res) => {
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
};

const UpdateaUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const updateUser = await User.findByIdAndUpdate(id, updateData, {
        new: true, // This option returns the updated document
      });
  
      if (!updateUser) {
          throw new Error('Contact not found');
      }
  
      res.status(204).json(updateUser);
    } catch (error) {
      throw new Error(error);
  }
  };


  // Logout Functionality

const logout = async (req, res) => {
    const cookie = req.cookies;
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
  };


const deleteaUser = async(req, res) => {
    const {id} = req.params;
    validateMongodbId(id)
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        if (!deleteaUser) {
            throw new Error('Contact not found');
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    createUser, 
    loginUserCtrl,
    loginAdmin,
    getallUser, 
    getaUser, 
    UpdateaUser,
    logout,
    deleteaUser
}