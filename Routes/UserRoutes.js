const express = require('express')
const router = express.Router()
const UserControllers =  require('../Controllers/UserControllers')


router.get('/' , UserControllers.getForm  )


router.post('/result' , UserControllers.showResult )
router.get('/getReverseName' , UserControllers.giveReverse)
router.post('/user-register' , UserControllers.register)
router.post('/user-login' , UserControllers.login)
router.get('/get-all-users' , UserControllers.getAllUsers)
router.post('/update-user-email' , UserControllers.updateUserEmail )
router.post('/change-password' , UserControllers.changePassword )






module.exports = router