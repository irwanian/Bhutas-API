const express = require('express')
const router = express.Router()

const { usersController } = require('../Controller')

router.get('/allusers', usersController.getAllUsers)
router.get('/user', usersController.searchUser) 
router.post('/addnewuser', usersController.registerNewUser)
router.put('/verification', usersController.emailVerification)
router.post('/resendemailverification', usersController.resendEmailVerification)
router.post('/keeplogged', usersController.keepLogged)
router.post('/login', usersController.login)

module.exports = router