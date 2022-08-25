const express = require('express')
const router = express.Router()
const AuthToken = require('../lib/auth/authToken')
const Dashboard = require('../lib/dashboard/dashboard')
const Item = require('../lib/dashboard/item')
const Category = require('../lib/dashboard/category')
const recommendations = require('../lib/dashboard/recommendations.json')

// get dashboard
router.get('/', AuthToken.verify, (req, res) => {
    Dashboard.get(req.userId)
    .then((result) => {
        res.status(200).json({ error: false, message: null, result: { runningOut: result[0] || [], categories: result[1] || [] } })
    })
    .catch((err) => {
        res.status(500).json({ error: true, message: err, result: null })
    })
})

router.get('/recommendations', (req, res) => {
    res.status(200).json(recommendations)
})

// add category
router.post('/category/create', AuthToken.verify, (req, res) => {
    const categoryName = req.body.category
    if (categoryName == null) {
        res.status(400).json({ error: true, message: 'category not sent' })
        return
    }
    Category.create(req.userId, categoryName)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Created category' })
        } else {
            res.status(500).json({ error: true, message: 'Error occured' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

// delete category
router.post('/category/delete', AuthToken.verify, (req, res) => {
    const categoryId = req.body.categoryId
    if (categoryId == null) {
        res.status(400).json({ error: true, message: 'categoryId not sent' })
        return
    }
    Category.delete(req.userId, categoryId)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Deleted category' })
        } else {
            res.status(500).json({ error: true, message: 'Error occured' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

// edit category name
router.post('/category/edit', AuthToken.verify, (req, res) => {
    const categoryId = req.body.categoryId
    const category = req.body.category
    if (categoryId == null || category == null) {
        res.status(400).json({ error: true, message: 'categoryId or category not sent' })
        return
    }
    Category.editName(category, req.userId, categoryId)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Edited category name' })
        } else {
            res.status(500).json({ error: true, message: 'Error occured' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

// create item
router.post('/item/create', AuthToken.verify, (req, res) => {
    const categoryId = req.body.categoryId
    const name = req.body.name
    const quantity = req.body.quantity

    if (categoryId == null || name == null || quantity == null) {
        res.status(400).json({ error: true, message: 'One or more parameters are missing' })
        return
    }
    Item.create(name, categoryId, quantity, req.userId, req.body.image, req.body.roQuantity, req.body.unit)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Created item' })
        } else {
            res.status(500).json({ error: true, message: 'Error occured' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

// delete item
router.post('/item/delete', AuthToken.verify, (req, res) => {
    const itemId = req.body.itemId

    if (itemId == null) {
        res.status(400).json({ error: true, message: 'itemId not found in request body' })
        return
    }
    Item.delete(itemId, req.userId)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Deleted item' })
        } else {
            res.status(500).json({ error: true, message: 'Error occured' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})

// change item quantity
router.post('/item/quantity', AuthToken.verify, (req, res) => {
    const itemId = req.body.itemId
    const quantity = req.body.quantity
    if (itemId == null || quantity == null) {
        res.status(400).json({ error: true, message: 'itemId or quantity not found in request body' })
        return
    }
    Item.changeQuantity(req.userId, itemId, quantity)
    .then((result) => {
        if (result) {
            res.status(200).json({ error: false, message: 'Updated quantity' })
        } else {
            res.status(500).json({ error: true, message: 'Error occured' })
        }
    })
    .catch((err) => {
        res.status(400).json({ error: true, message: err })
    })
})


module.exports = router
