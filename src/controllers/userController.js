const User = require('../models/authModel');
const validateMongodbId = require('../utils/validateMongodbId');


const createUser = async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        // Create a new user
        const newUser = await User.create(req.body);
        res.status(201).json({ acknowledged:true, insertedId: newContact.id });
    } else {
        // User already exists
        throw new Error('User Already Exists');
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


const deleteaUser = async(req, res) => {
    const {id} = req.params;
    validateMongodbId(id)
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    createUser, 
    getallUser, 
    getaUser, 
    UpdateaUser,
    deleteaUser
}