const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT =  8765
const UserRoutes = require('./Routes/UserRoutes')
const db = require('./DB/Db')

require('dotenv').config()


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended : true}))

app.use('/user' ,  UserRoutes)






app.listen(PORT , () =>{
    console.log(`Server is running on PORT : ${PORT}`)
})







