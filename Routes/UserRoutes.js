const express = require('express')
const router = express.Router()
const UserControllers =  require('../Controllers/UserControllers')


router.get('/' , UserControllers.getForm  )


router.post('/result' , UserControllers.showResult )






module.exports = router