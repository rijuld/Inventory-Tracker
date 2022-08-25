const express = require('express')
const router = express.Router()
const AuthToken = require('../lib/auth/authToken')
const Accounts = require('../lib/accounts/account')
const OTP = require('../lib/accounts/otp')

router.post('/complete', AuthToken.verify, (req, res) => {
    if (req.body.username == null || req.body.profession == null) {
        res.status(400).json({ error: true, message: "Please include username and profession parameter in request body" })
    }
    Accounts.updateDetails(req.userId, req.body.username, req.body.profession)
    .then((result) => {
        res.status(200).json({ error: false, message: "Updated details" })
    })
    .catch((err) => {
        res.status(500).json({ error: true, message: err })
    })
})

router.get('/otp', AuthToken.verify, (req, res) => {
    const phone = req.query.phone
    const hash = req.query.hash
    if (phone == null || hash == null) {
        res.status(400).json({ error: true, message: 'phone or hash not found' })
        return
    }
    OTP.request(phone, req.userId, hash)
    .then((sent) => {
        res.status(200).json({ error: false, message: 'Sent OTP successfully' })
    })
    .catch((err) => {
        res.status(500).json({ error: true, message: err })
    })
})

router.post('/otp', AuthToken.verify, (req, res) => {
    const otp = req.body.otp
    if (otp == null) {
        res.status(400).json({ error: true, message: 'otp not found' })
        return
    }
    OTP.verify(otp, req.userId)
    .then((result) => {
        res.status(200).json({ error: false, message: 'Successfully verified phone number' })
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

module.exports = router