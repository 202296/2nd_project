const express = require('express');
const {
    createUser, 
    getallUser, 
    getaUser, 
    deleteaUser, 
    UpdateaUser,  
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', createUser);
router.get('/all-users', getallUser)
router.get('/:id', getaUser);

module.exports = router;