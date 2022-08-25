const Database = require('../database/database')
const database = new Database('oops')
const Account = require('./account')
const sendSMS = require('./sendSMS')

const generateNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const checkCooldown = (userId) => {
    return new Promise((resolve, reject) => {
        console.log('reached here')
        const sql = 'SELECT exp FROM unverified_phone WHERE userId = ?';
        database.call(sql, [userId])
        .then((result)=> {
            if (result[0] == null) {
                // first OTP request
                resolve(true)
                return
            }
            const createdAtStamp = result[0].exp - 10 * 60
            const nowStamp = Date.now() / 1000
            if (nowStamp - createdAtStamp < 2 * 60) { // 2 minute cooldown
                resolve(false)
                return
            }
            resolve(true)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const requestOTP = (phone, userId, hash) => {
    return new Promise((resolve, reject) => {
        checkCooldown(userId)
        .then((afterCooldown) => {
            if (afterCooldown) {
                // proceed with sending otp
                // generate OTP
                const otp = generateNumber()
                // get expiry of OTP
                const exp = Math.floor(Date.now() / 1000) + 10 * 60 // 10 minutes
                // enter into database
                const sql = 'REPLACE INTO unverified_phone (phone, otp, exp, userId, retries) VALUES (?, ?, ?, ?, 0)'
                database.call(sql, [phone, otp, exp, userId])
                .then((result) => {
                    sendSMS(phone, otp, hash)
                    console.log('requested OTP', otp)
                    resolve(result.affectedRows > 0)
                })
                .catch((err) => {
                    reject(err)
                })
            } else {
                reject('Please wait atleast 2 minutes before requesting OTP again.')
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const incrementOTPRetries = (userId, newValue) => {
    const sql = 'UPDATE unverified_phone SET retries = ? WHERE userId = ?';
    database.call(sql, [newValue, userId])
    .then((result) => { })
    .catch((_) => { })
}

const verifyOTP = (otp, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * from unverified_phone WHERE userId = ?'
        database.call(sql, [userId])
        .then((result) => {
            if (result.length == 0) {
                reject('OTP was never sent')
                return
            }
            const otpDetails = result[0]
            const existingOTP = otpDetails.otp
            const exp = otpDetails.exp
            const retries = otpDetails.retries
            console.log(retries)
            if ((Date.now() / 1000) > exp) {
                reject('OTP expired')
                return
            }
            if (retries >= 3) {
                reject('Max retries reached. Please request OTP again.')
                return
            }
            if (otp == existingOTP) {
                Account.addPhone(otpDetails.phone, userId)
                .then((result) => {
                    resolve(true)
                })
                .catch((err) => {
                    reject(err)
                })
            } else {
                incrementOTPRetries(userId, retries + 1)
                reject('Incorrect OTP')
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

module.exports = {
    request: requestOTP,
    verify: verifyOTP
}