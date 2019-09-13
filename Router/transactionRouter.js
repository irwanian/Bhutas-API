const express = require('express')
const router = express.Router()

const { transactionController } = require('../Controller')

router.get('/usercart/:id', transactionController.getUserCartData)
router.post('/addtocart', transactionController.addToCart)

module.exports = router