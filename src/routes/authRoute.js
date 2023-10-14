const express = require('express');
const {
    createUser, 
    getallUser, 
    getaUser, 
    UpdateaUser,
    deleteaUser 
} = require('../controllers/userController');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.post('/register', asyncHandler(createUser));
router.get('/all-users', asyncHandler(getallUser));
router.get('/:id', asyncHandler(getaUser));
router.delete('/:id', asyncHandler(deleteaUser));
router.put('/:id', asyncHandler(UpdateaUser));

module.exports = router;