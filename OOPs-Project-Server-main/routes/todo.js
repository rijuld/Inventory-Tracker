const express = require('express')
const router = express.Router()
const AuthToken = require('../lib/auth/authToken')
const Todo = require('../lib/todo/todo')

// create task
router.post('/item/create', AuthToken.verify, (req, res) => {
    //get the variables in the body
    const title = req.body.title
    const tasktime = req.body.tasktime
    const description = req.body.description
    //the title and the task should surely be given
    if (title == null) {
        res.status(400).json({ error: true, message: 'Title or task is missing' })
        return
    }
    //from the todo module use the create function
    Todo.create(title, tasktime, req.userId, description)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Created task' })
        } else {
            res.status(500).json({ error: true, message: 'An error occurred' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

// delete task
router.post('/item/delete', AuthToken.verify, (req, res) => {
    const taskId = req.body.taskId

    if (taskId == null) {
        res.status(400).json({ error: true, message: 'taskId not found in request body' })
        return
    }
    Todo.delete(taskId, req.userId)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Deleted the task!' })
        } else {
            res.status(500).json({ error: true, message: 'An error occurred' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})


router.post('/item/edit', AuthToken.verify, (req, res) => {
    const taskId = req.body.taskId
    const title = req.body.title
    const tasktime = req.body.tasktime

    if(taskId == null || title == null || tasktime == null) {
        res.status(400).json({ error: true, message: 'One or more parameters were missing' })
        return
    }
    Todo.edit(taskId, req.userId, title, req.body.description, tasktime)
    .then((success) => {
        if (success) {
            res.status(200).json({ error: false, message: 'Task was edited successfully' })
        } else {
            res.status(500).json({ error: true, message: 'Something when wrong' })
        }
    })
    .catch((err) => {
        res.status(500).json({ error: true, message: err })
    })
})

// get todo
router.get('/', AuthToken.verify, (req, res) => {
    Todo.get(req.userId)
    .then((result) => {
        res.status(200).json({ error: false, message: null, result: { todo: result } })
    })
    .catch((err) => {
        res.status(500).json({ error: true, message: err, result: null })
    })
})

module.exports = router
