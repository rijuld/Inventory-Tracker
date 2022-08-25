const Database = require("../database/database");
const database = new Database('oops')
const AuthToken = require('../auth/authToken');
const auth = require("../auth/auth");

const checkAccountExistance = (sub) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE userId = ?'
        database.call(sql, [sub])
        .then((result) => {
            resolve({ exists: result.length != 0, result: result })
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const createAccount = (sub, name, email) => {
    return new Promise((resolve, reject) => {
        console.log(sub, name, email)
        const sql = 'INSERT INTO users (userId, name, email) VALUES (?, ?, ?)'
        database.call(sql, [sub, name, email])
        .then((result) => {
            resolve(result.affectedRows == 1)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const loginOrCreateAccount = (sub, name, email) => {
    return new Promise((resolve, reject) => {
        checkAccountExistance(sub)
        .then((returned) => {
            if (returned.exists) {
                details = returned.result[0]
                const phoneVerified = details.phone != null
                const professionGiven = details.profession != null
                const authToken = AuthToken.generate({ userId: details.userId })
                console.log(authToken)
                const payload = {
                    userId: details.userId,
                    name: details.name,
                    username: details.username,
                    email: details.email,
                    phoneVerified: phoneVerified,
                    professionGiven: professionGiven,
                    phone: details.phone || null,
                    profession: details.profession || null,
                    authToken: authToken
                }
                resolve(payload)
            } else {
                createAccount(sub, name, email)
                .then((created) => {
                    if (!created) {
                        reject('Error creating new account')
                        return
                    }
                    loginOrCreateAccount(name, email)
                    .then((result) => {
                        resolve(result)
                    })
                    .catch((err) => {
                        reject(err)
                    })
                })
            }
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

const checkIfUsernameExists = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT 1 FROM users WHERE username = ?'
        database.call(sql, [username])
        .then((result) => {
            resolve(result.length != 0)
        })
        .catch((err) => {
            reject(err)
        })
    })
    
}

const updateDetails = (userId, username, profession) => {
    return new Promise((resolve, reject) => {
        checkIfUsernameExists(username)
        .then((exists) => {
            if (exists) {
                console.log('what is gooing on')
                reject('User with that username already exists')
                return
            }
            const sql = 'UPDATE users SET username = ?, profession = ? WHERE userId = ?'
            const params = [username, profession, userId]
            console.log("praning params", params)
            console.log('here')
            database.call(sql, params)
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    })
    
}

const addPhoneNumberToAccount = (phone, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET phone = ? WHERE userId = ?'
        database.call(sql, [phone, userId])
        .then((result) => {
            resolve(result.affectedRows > 0)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

module.exports = {
    loginOrCreateAccount: loginOrCreateAccount,
    updateDetails: updateDetails,
    addPhone: addPhoneNumberToAccount
}