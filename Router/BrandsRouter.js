const express = require('express')
const router = express.Router()

const { brandController } = require('../Controller')

router.get('/allbrands', brandController.getBrands)
router.get('/certainbrands/:id', brandController.getCertainBrands)
router.post('/addbrands', brandController.addBrands)
router.delete('/deletebrands/:id', brandController.deleteBrands)
router.put('/editbrands/:id', brandController.editBrands)

module.exports = router