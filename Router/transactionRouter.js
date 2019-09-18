const express = require('express')
const router = express.Router()

const { transactionController } =require('../Controller')

router.get('/usertransaction/:id', transactionController.getTrxData)
router.get('/unsent', transactionController.getUnsentItems)
router.get('/confirmdelivery/:id', transactionController.gensentItems)
router.get('/admin-history', transactionController.getAdminTrxHistory)
router.get('/user-history/:id', transactionController.getUserTrxHistory)
router.get('/waiting', transactionController.getUnapprovedTrx)
router.get('/detail/:id', transactionController.unapprovedTrxDetail)
router.put('/senditems/:id', transactionController.sendItems)
router.put('/received/:id', transactionController.receiveItems)
router.put('/updatetrx/:id', transactionController.uploadTrx)
router.put('/approval/:id', transactionController.acceptTrx)
router.put('/rejection/:id', transactionController.rejectTrx)

module.exports = router