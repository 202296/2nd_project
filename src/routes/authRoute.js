const express = require('express');
const {
    createUser, 
    loginUserCtrl, 
    getallUser, 
    getaUser, 
    deleteaUser, 
    UpdateaUser, 
    handleRefreshToken, 
    logout, 
    loginAdmin,
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post("/admin-login", loginAdmin);

router.get('/all-users', getallUser);

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);

router.get('/:id', authMiddleware , isAdmin, getaUser);
router.delete('/:id', deleteaUser);

router.put('/edit-user', authMiddleware, UpdateaUser);

module.exports = router;