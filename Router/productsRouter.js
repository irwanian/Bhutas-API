const express = require('express')
const router = express.Router()

const {productsController} = require('../Controller')

router.get('/allproducts', productsController.getProducts)
router.get('/saleproducts', productsController.getSaleProducts)
router.get('/newarrivals', productsController.getNewArrivals)
router.post('/addproduct', productsController.addNewProduct)
router.get('/searchproducts', productsController.searchProducts)
router.get('/productdetail/:id', productsController.getSpecifictProduct)
router.put('/deleteproduct/:id', productsController.deleteProduct)
router.patch('/editproduct/:id', productsController.editProduct)
router.get('/stocks/:id', productsController.getTotalStocks)
router.patch('/stocks/:id', productsController.updateProductStock)

module.exports = router