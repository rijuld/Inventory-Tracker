const express = require('express')
const app = express()
const port = process.env.port || 3000

app.use(express.json())

let authRouter = require('./routes/auth.js')
let accountRouter = require('./routes/accounts.js')
let dashboardRouter = require('./routes/dashboard.js')
let todoRouter = require('./routes/todo.js')

app.use('/auth', authRouter)
app.use('/account', accountRouter)
app.use('/dashboard', dashboardRouter)
app.use('/todo', todoRouter)

app.get('/test/', (req, res) => {
    res.json({ "message": "Hello world", "anotherMessage": "Another hello world" })
})



app.listen(port, () => {
    console.log('Listening on port', port)
})