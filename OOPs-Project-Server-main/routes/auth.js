const express = require('express')
const router = express.Router()
const Auth = require('../lib/auth/auth')
const Accounts = require('../lib/accounts/account')

router.post('/google', (req, res) => {
    const idToken = req.body.idToken
    if (idToken == null) {
        res.status(400).json({ error: true, message: 'ID Token not found in request body' })
        return
    }
    Auth.verifyIdToken(idToken)
    .then((payload) => {
        const name = payload.name
        const email = payload.email
        const sub = payload.sub
        Accounts.loginOrCreateAccount(sub, name, email)
        .then((result) => {
            res.status(200).json({ error: false, message: "Success", result: result })
        })
        .catch((err) => {
            res.status(500).json({ error: true, message: err })
        })
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: "Invalid id token" })
    })
})

module.exports = router