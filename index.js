const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
//allows access from all origins
app.use(cors())
//allows us to use res.json
app.use(express.json())

//bodyparser middleware
app.use(express.urlencoded({extended: false}))
//controller middleware
app.use('/api', require('./controllers/users'))
app.use('/post', require('./controllers/post'))

app.listen(process.env.PORT || 8000, ()=>{
    console.log('Yo! We got a connection here!')
})