const jwt = require('jsonwebtoken')
const privateKey = 'temporary_private_key'

const generateAuthToken = (payload) => {
    const token = jwt.sign(payload, privateKey, { expiresIn: '30d' })
    return token
}

const verifyAuthToken = (req, res, next) => {
    var token = null
    if (req.method == 'GET') {
        token = req.query.authToken
    } else if (req.method == 'POST') {
        token = req.body.authToken
    }
    if (token == null) {
        res.status(400).json({ error: true, message: 'authToken not provided' })
    }
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
          res.status(400).json({ error: true, message: 'Token error: ' + err })
          return
        }
        if (Date.now() > decoded.exp * 1000) {
            res.status(400).json({ error: true, message: 'Token error: Token has expired' })
            return
        }
        const userId = decoded.userId
        if (userId == null) {
            res.status(400).json({ error: true, message: 'Token error' })
            return
        }
        req.userId = userId
        next()
    })
}

module.exports = {
    generate: generateAuthToken,
    verify: verifyAuthToken // middleware
}