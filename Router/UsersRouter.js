const express = require('express')
const router = express.Router()

const { usersController } = require('../Controller')

router.get('/allusers', usersController.getAllUsers)
router.get('/user', usersController.searchUser) 
router.post('/addnewuser', usersController.registerNewUser)
router.put('/verification', usersController.emailVerification)
router.post('/resendemailverification', usersController.resendEmailVerification)
router.get('/keeplogged', usersController.keepLogged)
router.post('/login', usersController.login)
router.put('/logout', usersController.logoutUser)


module.exports = router