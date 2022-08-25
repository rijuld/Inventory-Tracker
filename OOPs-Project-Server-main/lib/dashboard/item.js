const Database = require('../database/database')
const database = new Database('oops')
const Category = require('./category')

// create new item
const createNewItem = (name, categoryId, quantity, userId, image = null, roQuantity = null, unit = null) => {
    return new Promise((resolve, reject) => {
        if (quantity < 0 || !Number.isInteger(quantity)) {
            reject('Quantity specified incorrectly')
            return
        }
        Category.checkId(userId, categoryId)
        .then((category) => {
            if (category == null) {
                reject('Category ID does not exist or you do not have access to it.')
                return
            }
            const sql = 'INSERT INTO items (name, categoryId, category, quantity, unit, roQuantity, image, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            database.call(sql, [name, categoryId, category, quantity, unit, roQuantity, image, userId])
            .then((result) => {
                resolve(result.affectedRows > 0)
            })
            .catch((err) => {
                reject(err)
            })
        })
    })
}


// delete item
const deleteItem = (itemId, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM items WHERE userId = ? AND itemId = ?'
        database.call(sql, [userId, itemId])
        .then((result) => {
            if (result.affectedRows == 0) {
                reject('Item does not exist or user does not have access to this item')
            } else {
                resolve(true)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

// change item quantity
const changeItemQuantity = (userId, itemId, quantity) => {
    return new Promise((resolve, reject) => {
        if (quantity < 0 && Number.isInteger(quantity)) {
            reject('Quantity specified incorrectly')
            return
        }
        const sql = 'UPDATE items SET quantity = ? WHERE itemId = ? AND userId = ?'
        database.call(sql, [quantity, itemId, userId])
        .then((result) => {
            if (result.affectedRows == 0) {
                reject('Item does not exist or the user does not have access to it')
            } else {
                resolve(result.affectedRows > 0)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}


module.exports = {
    create: createNewItem,
    delete: deleteItem,
    changeQuantity: changeItemQuantity
}

// createNewItem('Rice', 1, 100, '102053560811600653692', 'sample rice link')
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })

// changeItemQuantity('102053560811600653692', 3, 100)
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })

// deleteItem(3, '102053560811600653692')
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })
