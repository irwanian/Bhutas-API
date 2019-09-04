const express = require('express')
const router = express.Router()

const {categoriesController} = require('../Controller')

router.get('/allcategories', categoriesController.getCategories)
router.post('/addcategories', categoriesController.addCategories)
router.delete('/deletecategories/:id', categoriesController.deleteCategories)
router.put('/editcategories/:id', categoriesController.editcategories)
router.get('/category/:id', categoriesController.getCertaincategory)



module.exports = router