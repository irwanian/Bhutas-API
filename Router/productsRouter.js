const express = require('express')
const router = express.Router()

const {productsController} = require('../Controller')

router.get('/allproducts', productsController.getProducts)
router.get('/saleproducts', productsController.getSaleProducts)
router.get('/newarrivals', productsController.getNewArrivals)
router.post('/addproduct', productsController.addNewProduct)
router.get('/searchproducts', productsController.searchProducts)


module.exports = router