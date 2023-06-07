const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT =  8765
const UserRoutes = require('./Routes/UserRoutes')
const db = require('./DB/Db')
// const mailService = require('./Mailer/mail')




require('dotenv').config()


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended : true}))

app.use("/static",express.static(__dirname+ '/uploads'));

app.use('/user' ,  UserRoutes)






app.listen(PORT , () =>{
    console.log(`Server is running on PORT : ${PORT}`)
})







