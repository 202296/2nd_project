const express = require('express');
const {
    createUser, 
    loginUserCtrl,
    loginAdmin,
    getallUser, 
    getaUser, 
    UpdateaUser,
    deleteaUser 
} = require('../controllers/userController');
const asyncHandler = require('express-async-handler');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', asyncHandler(createUser));
router.post('/login', asyncHandler(loginUserCtrl));
router.post("/admin-login", asyncHandler(loginAdmin));
router.get('/all-users', asyncHandler(getallUser));
router.get('/:id', authMiddleware, isAdmin, asyncHandler(getaUser));
router.put('/:id', authMiddleware, asyncHandler(UpdateaUser));
router.delete('/:id', asyncHandler(deleteaUser));


module.exports = router;