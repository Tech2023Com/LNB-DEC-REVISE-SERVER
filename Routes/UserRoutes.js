const express = require('express')
const router = express.Router()
const UserControllers =  require('../Controllers/UserControllers')


router.get('/' , UserControllers.getForm  )


router.post('/result' , UserControllers.showResult )
router.get('/getReverseName' , UserControllers.giveReverse)
router.post('/user-register' , UserControllers.register)






module.exports = router