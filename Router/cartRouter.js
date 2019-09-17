const express = require('express')
const router = express.Router()

const { cartController } = require('../Controller')

router.get('/usercart/:id', cartController.getUserCartData )
router.post('/addtocart', cartController.addToCart)
router.get('/cartcontent/:id', cartController.getCartTotalQty)
router.put('/deletecart/:id', cartController.deleteCartProduct)
router.post('/addtransaction/:id', cartController.cartCheckout)

module.exports = router