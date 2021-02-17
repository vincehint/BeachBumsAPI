const express = require('express')
const app = express()
const cors = require('cors')
//allows access from all origins
app.use(cors())
//allows us to use res.json
app.use(express.json())

//bodyparser middleware
app.use(express.urlencoded({extended: false}))

app.use('/api', require('./controllers/users'))

app.listen(process.env.PORT || 8000, ()=>{
    console.log('Yo! We got a connection here!')
})