
const path  = require('path')
const UserSchema = require('../Schemas/UserSchema')
const bcrypt = require('bcrypt')


exports.getForm  = (req,res) =>{

    var root = path.dirname('C:\\LNB-DEC-\\Server\\Templates\\')
    console.log(root)

    res.sendFile(root + '/Templates/demo.html')

//     res.send(`<html>
//     <head>
//         <title>REG Form</title>
//     </head>
//     <body>
//         <form method="POST" action="/user/result" >
//             <input name="n1" placeholder="Enter any number"  />
//             <button>Check</button>
//         </form>
//     </body>
// </html>`)
}

exports.showResult = (req,res) =>{

    var num  =  parseInt(req.body.n1)
    if(num % 2 == 0 )
    {

        res.send(`<h1 style="color:green" >${num} is Even Number</h1>`)
    }
    else{
        
        res.send(`<h1 style="color:red" >${num} is Odd Number</h1>`)
    }

}


exports.giveReverse= (req,res)=>{
    const {name} =  req.query

    var str  = name.split("").reverse().join("")
    res.send(`Your Reverse String is :  ${str}`)

}


exports.register = (req,res)=>{
    const {name , email , mobile , password} = req.body;

    if(!password )
    {
        res.status(400).send({status :400 , message : "Password is Required"})
        
    }
    else
    {


    bcrypt.genSalt(10, function(err ,  salt){
        if(err){
            res.status(500).send({status : 500 ,  message  :"Something Went Wrong"})
        }
        else
        {
                bcrypt.hash(password ,salt ,  function(err , hash){
                    if(err){
                        res.status(500).send({status : 500 ,  message  :"Something Went Wrong"})
                    }
                    else{

                           UserSchema.insertMany({name : name ,  email :  email ,  mobile : mobile ,  password : hash }).then((result)=>{
console.log(result)
res.status(200).send({status : 200 ,  message : "User Created Successfully"})
    }).catch((err)=>{
        if(err.name ==  "ValidationError")
        {
            res.status(400).send({ status : 400, message : `${err.message.split(":")[1].trim()} Cannot be Empty ): `})
        }
        else if(err.name == "MongoBulkWriteError")
        {

        let key  = err.message.split(":")[3].replace("{" , "").trim()
        let value  = err.message.split(":")[4].replace("}" , "").trim()
        res.status(409).send({ status :  409, message : `User , with this ${key} (${value}) already exists ):`})
        }
        else{

            res.status(500).send({ status : 500, message : "Something Went Wrong" , err : err})
        }
    })

                    }
                }  ) 
        }
    })

}
} 


exports.login=  (req,res) =>{
        const {email  ,password}  = req.body
        if(!email  || !password)
        {
            res.status(400).send({status : 400 ,  message : "Email & Password is Required"})
        }
        else
        {


        UserSchema.find({email : email}).then((result)=>{
            if(result.length > 0)
            {
                    bcrypt.compare(password ,  result[0].password , function(err ,  auth ){

                        if(err)
                        {
                            res.status(500).send({status : 500 ,  message  :"Something Went Wrong"})

                        }
                        else
                        {
                                const {name , email , mobile , _id} = result[0]
                                if(auth == true)
                                {
                                    res.status(200).send({status : 200 , message : "User Login Successfully" , data: { id : _id, name: name , email:email ,  mobile :mobile}})
                                }
                                else{
                                    res.status(401).send({status: 401 , message : "Incorrect Password"})
                                }
                        }

                    })
            }
            else
            {
                res.status(404).send({ status: 404 , message :  "User not found"})
            }
        }).catch((err)=>{
            console.log(err)
            res.status(500).send({status: 500 ,  message : "Soemthing Went Wrong"})
        })

    }

}



exports.getAllUsers = (req,res)=>{

    UserSchema.find({}).then((result)=>{
        res.status(200).send(result)
    }).catch((err)=>{
        res.status(500).send({status :  500 , message :  "Something Went Wrong"})
    })

}


