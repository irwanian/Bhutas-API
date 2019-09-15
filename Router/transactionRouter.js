const express = require('express')
const router = express.Router()

const { transactionController } = require('../Controller')

router.get('/usercart/:id', transactionController.getUserCartData)
router.post('/addtocart', transactionController.addToCart)
router.get('/cartcontent/:id', transactionController.getCartTotalQty)

module.exports = router