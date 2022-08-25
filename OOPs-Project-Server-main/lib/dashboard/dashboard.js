const Database = require('../database/database')
const category = require('./category')
const database = new Database('oops')

const getRunningOut = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM items WHERE roQuantity IS NOT NULL AND userId = ? AND quantity <= roQuantity'
        database.call(sql, [userId])
        .then((result) => {
            resolve(result)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const getDashboard = (userId) => {
    return new Promise((resolve, reject) => {
        getRunningOut(userId)
        .then((roResult) => {
            const sql = 'SELECT * FROM categories WHERE userId = ? ORDER BY categoryId DESC'
            database.call(sql, [userId])
            .then((result) => {
                const toAppend = 'SELECT * FROM items WHERE categoryId = ? AND quantity > roQuantity ORDER BY itemId DESC;'
                var sql = ''
                var params = []
                var set = false
                const categoryCount = result.length
                for (var i = 0; i < categoryCount; i++) {
                    const categoryId = result[i].categoryId
                    set = true
                    sql += toAppend
                    params[i] = categoryId
                }
                if (!set) {
                    resolve([])
                    return
                }
                database.call(sql, params)
                .then((items) => {
                    if (categoryCount == 1) {
                        result[0].items = items
                        console.log(result)
                        resolve([roResult, result])
                    } else {
                        for (var i = 0; i < categoryCount; i++) {
                            result[i].items = items[i]
                        }
                        console.log(result)
                        resolve([roResult, result])
                    }
                })
            })
            .catch((err) => {
                reject(err)
            })
        })
        .catch((err) => {
            reject(err)
        })

        
    })
}

module.exports = {
    get: getDashboard
}

// getDashboard('102053560811600653692')
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })