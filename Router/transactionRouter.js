const express = require('express')
const router = express.Router()

const { transactionController } =require('../Controller')

router.get('/usertransaction/:id', transactionController.getTrxData)
router.put('/updatetrx/:id', transactionController.uploadTrx)
router.put('/approval/:id', transactionController.acceptTrx)
router.put('/rejection/:id', transactionController.rejectTrx)
router.get('/unsent', transactionController.getUnsentItems)
router.put('/senditems/:id', transactionController.sendItems)
router.put('/received/:id', transactionController.receiveItems)
router.get('/history/:id', transactionController.getAdminTrxHistory)
router.get('/waiting', transactionController.getUnapprovedTrx)
router.get('/detail/:id', transactionController.unapprovedTrxDetail)

module.exports = router