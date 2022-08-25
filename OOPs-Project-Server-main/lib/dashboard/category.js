const Database = require('../database/database')
const database = new Database('oops')

// create new category
const createNewCategory = (userId, category) => {
    return new Promise((resolve, reject) => {
        checkIfCategoryOfThatNameExistsForUserId(userId, category)
        .then((exists) => {
            if (exists) {
                reject('A category with that name already exists for this user')
                return
            }
            const sql = 'INSERT INTO categories (userId, category) VALUES (?, ?)'
            database.call(sql, [userId, category])
            .then((result) => {
                resolve(result.affectedRows > 0)
            })
            .catch((err) => {
                reject(err)
            })
        })
    })
}

const checkIfCategoryOfThatNameExistsForUserId = (userId, category) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT 1 FROM categories WHERE userId = ? AND category = ?'
        database.call(sql, [userId, category])
        .then((result) => {
            resolve(result.length > 0)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

// delete category
const deleteCategory = (userId, categoryId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM categories WHERE userId = ? AND categoryId = ?; DELETE FROM items WHERE categoryId = ?'
        database.call(sql, [userId, categoryId, categoryId])
        .then((result) => {
            if (result[0].affectedRows == 0) {
                reject('Category does not exist or the user does not have access to it')
            } else {
                resolve(result[0].affectedRows > 0)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

// edit category name
const editCategoryName = (category, userId, categoryId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE categories SET category = ? WHERE userId = ? AND categoryId = ?'
        database.call(sql, [category, userId, categoryId])
        .then((result) => {
            if (result.affectedRows == 0) {
                reject('Category does not exist or the user does not have access to it')
            } else {
                resolve(true)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const checkCategoryId = (userId, categoryId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT category FROM categories WHERE userId = ? AND categoryId = ?'
        database.call(sql, [userId, categoryId])
        .then((result) => {
            resolve(result[0].category)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

module.exports = {
    create: createNewCategory,
    delete: deleteCategory,
    editName: editCategoryName,
    checkId: checkCategoryId
}

// createNewCategory('102053560811600653692', 'Pet supplies')
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })

// editCategoryName('Groceries', '102053560811600653692', 8)
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })

// deleteCategory('102053560811600653692', 8)
// .then((result) => {
//     console.log(result)
// })
// .catch((err) => {
//     console.log(err)
// })
//