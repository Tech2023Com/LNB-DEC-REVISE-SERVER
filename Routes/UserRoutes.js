const express = require('express')
const router = express.Router()
const UserControllers =  require('../Controllers/UserControllers')
const upload = require('../Multer_Uploader/upload_file')



router.get('/' , UserControllers.getForm  )




router.post('/result' , UserControllers.showResult )
router.get('/getReverseName' , UserControllers.giveReverse)
router.post('/user-register' , UserControllers.register)
router.post('/user-login' , UserControllers.login)
router.get('/get-all-users'  , UserControllers.ValidateToken, UserControllers.getAllUsers)
router.post('/update-user-email' , UserControllers.updateUserEmail )
router.post('/change-password' , UserControllers.changePassword )
router.post('/delete-user' , UserControllers.deleteUser )
router.post('/dummyLogin' , UserControllers.dummyLogin)
router.post('/checkOE' , UserControllers.ValidateToken, UserControllers.checkOddEven)
router.post("/upload-images" , upload.array("files") , UserControllers.uploadFile)

// router.post('/validateToken' , UserControllers.ValidateToken)  






module.exports = router