Database = require('../database/database')
const database = new Database('oops')
const createNewTask = (title, tasktime, userId, description = null) => {
    return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO task (title, description, tasktime, userId) VALUES (?, ?, ?, ?)'
            database.call(sql, [title, description, tasktime, userId])
            .then((result) => {
                resolve(result.affectedRows > 0)
            })
            .catch((err) => {
                reject(err)
            })
        })
}
//(STR_TO_DATE('yourDateTimeValue','%d/%m/%Y %H:%i:%s')
//
// delete task
const deleteTask = (taskId, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM task WHERE taskId = ? and userId = ?'
        database.call(sql, [taskId,userId])
        .then((result) => {
            console.log(result)
            if (result.affectedRows == 0) {
                reject('TASK does not exist or user does not have access to this item')
            } else {
                resolve(true)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}



const getTodo = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM task WHERE userId = ? ORDER BY time DESC'
        database.call(sql, [userId])
        .then((result) => {

            if (result.length == 0) {
                resolve([])
                return
            }
            for (var i = 0; i < result.length; i++) {
                result[i].time = result[i].time.toISOString().slice(0, 19).replace('T', ' ')
                result[i].tasktime = result[i].tasktime.toISOString().slice(0, 19).replace('T', ' ')
            }
            resolve(result)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

const editTask = (taskId, userId, title, description, tasktime) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE task SET title = ?, description = ?, tasktime = ? WHERE userId = ? AND taskId = ?'
        const params = [title, description, tasktime, userId, taskId]
        database.call(sql, params)
        .then((result) => {
            if (result.affectedRows == 0) {
                reject("Task with this taskId does not exist or you do not have access to it.")
            } else {
                resolve(true)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

//change task
// const changeTask = (taskId, description, userId) => {
//     return new Promise((resolve, reject) => {
//         const sql = 'UPDATE task SET description = ? WHERE taskId = ? AND userId= ?'
//         database.call(sql, [description, taskId, userId])
//         .then((result) => {
//             if (result.affectedRows == 0) {
//                 reject('Task does not exist or the user does not have access to it')
//             } else {
//                 resolve(result.affectedRows > 0)
//             }
//         })
//         .catch((err) => {
//             reject(err)
//         })
//     })
// }
// //  45072787
// // change task time
// const changeTaskTime = (taskId, tasktime, userId) => {
//     return new Promise((resolve, reject) => {
//         const sql = 'UPDATE task SET tasktime = ? WHERE taskId = ? AND userId= ?'
//         database.call(sql, [tasktime, taskId,userId])
//         .then((result) => {
//             if (result.affectedRows == 0) {
//                 reject('Task does not exist or the user does not have access to it')
//             } else {
//                 resolve(result.affectedRows > 0)
//             }
//         })
//         .catch((err) => {
//             reject(err)
//         })
//     })
// }

module.exports = {
    create: createNewTask,
    delete: deleteTask,
    edit: editTask,
    get: getTodo
}



