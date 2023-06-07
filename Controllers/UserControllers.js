
const path  = require('path')
const UserSchema = require('../Schemas/UserSchema')
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')








exports.uploadFile = (req,res)=>{
console.log(req.body)

    UserSchema.find({_id : req.body.id}).then((result)=>{
        console.log(result)
        if(result.length == 0)
        {
            res.status(400).send({status : 400 , message : "User Not Found"})
        }else
        {
           UserSchema.updateOne({_id : req.body.id} , {$set : {profile_pic : `http://localhost:8765/static/${req.file_name}`}}).then((u_result)=>{
            if(u_result.matchedCount == 1)
                                    {
                                        res.status(200).send({status : 200 ,  message : "Profile Updated Successfully"})
                                    }
                                    else
                                    {
                                        res.status(404).send({status : 404 ,  message : "Profile Not Updated"})
                            
                                    }
                                }).catch((err)=>{
                                    res.status(500).send({status : 500 , message : "Something Went Wrong"})
                                })
        
        }
    }).catch((err)=>{
        console.log(err)
        res.status(400).send({status : 400 , message : "Somthing Went Wrong"})
    })
    

}



exports.getForm  = (req,res) =>{

UserSchema.find({}).then((result)=>{
    var temp = ""


    for(let i = 0 ; i < result.length ; i++)
    {
        temp  = temp + `
        <tr>
        <td>${i+1}</td>
        <td>${result[i].name}</td>
        <td>${result[i].email}</td>
        <td>${result[i].mobile}</td>
        <td><button onclick="" >Delete User</button></td>
        </tr>`
    }

    res.send(`<html>
<head>
    <title>REG Form</title>
    <style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>
<body>
    
    <form method="POST" action="/user/user-register" >
        <input name="name" placeholder="Enter your Name"  />
        <input name="mobile" placeholder="Enter your Mobile"  />
        <input name="email" placeholder="Enter your Email"  />
        <input name="password" placeholder="Enter your Password"  />
        <h1 id='sp' ></h1>
        <button>Submit</button>
        <table   >
        <tr>
        <th>Sr. No</th>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        </tr>
        ${temp}
        </table>
    </form>
</body>
</html>`)


    
})    









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
// res.redirect('/user/')
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

    // user['token'] =  token
    // res.status(200).send(user)
    const {email  ,password}  = req.body
    var token  =  jwt.sign({ email:  email} , process.env.PRIVATE_KEY  ,{ expiresIn: "50s" } )
        if(!email  || !password)
        {
            res.status(400).send({status : 400 ,  message : "Email & Password is Required"})
        }
        else
        {


        UserSchema.find({email : email}).then((result)=>{
            console.log(result)
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


                                    // res.status(200).send({status : 200 , message : "User Login Successfully" , data: { id : _id, name: name , email:email ,  mobile :mobile}})
                                    UserSchema.updateOne({_id : _id } , {$set : {token  :  token}}).then((u_result)=>{
                                        if(u_result.matchedCount == 1)
                                        {
                                        res.status(200).send({status : 200 , message : "User Login Successfully" , data: { id : _id, name: name , email:email ,  mobile :mobile , token : token}})

                                        }
                                        else
                                        {

                                            res.status(500).send({status : 500 ,  message : "Something went wrong !! please try again ):"})

                                        }
                                    }).catch((err)=>{

                                        res.status(500).send({status : 500 ,  message : "Something went wrong !! please try again ):"})


                                    })
                                
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



exports.updateUserEmail = (req,res)=>{
    const  {id , email} =  req.body;
    UserSchema.updateOne({_id : id} , {$set : {email : email}}).then((result)=>{
        console.log(result)
        if(result.matchedCount == 1)
        {
            res.status(200).send({status : 200 ,  message : "Updated Successfully"})
        }
        else
        {
            res.status(404).send({status : 404 ,  message : "Not Updated"})

        }

    }).catch((err)=>{
        res.status(500).send({status :  500 , message :  "Something Went Wrong"})

    })

}


exports.changePassword = (req,res)=>{

    const {id,  o_pass , n_pass , c_pass  }  = req.body;

    if(n_pass !== c_pass)
    {
        res.status(400).send({  status : 400 , message : "Passowrd didn't Match"})
    }
    else
    {

    

    UserSchema.find({_id : id}).then((result)=>{
        
        bcrypt.compare(o_pass ,result[0].password  , function(err , auth){
            if(err)
            {
                res.status(500).send({status : 500  , message : "Something Went Wrong"})
            }
            else
            {
                    if(auth == false)
                    {
                        res.status(401).send({status  : 401 ,  message : "Old Password didn't macth"})
                    }
                    else
                    {
                        bcrypt.genSalt(10,  function(err , salt){
                            if(err)
                            {
                                res.status(500).send({status : 500  , message : "Something Went Wrong"})
                            }
                            else
                            {
                                    bcrypt.hash(n_pass , salt , function(err , hash){
                                        if(err)
                            {
                                res.status(500).send({status : 500  , message : "Something Went Wrong"})
                            }
                            else
                            {
                                UserSchema.updateOne({_id : id} , {$set : {password : hash}}).then((u_res)=>{
                                    if(u_res.matchedCount == 1)
                                    {
                                        res.status(200).send({status : 200 ,  message : "Password Updated Successfully"})
                                    }
                                    else
                                    {
                                        res.status(404).send({status : 404 ,  message : "Password Not Updated"})
                            
                                    }
                                }).catch((err)=>{
                                    res.status(500).send({status : 500 , message : "Something Went Wrong"})
                                })
                            }
                                    }  )
                            }
                        } )
                    }
            }
            
        })


    }).catch((err)=>{
        res.status(500).send({status : 500 , message : "Something Went Wrong"})


    })
}

}



exports.deleteUser  = (req,res) =>{
    const {id } =  req.body

    UserSchema.deleteOne({_id : id }).then((result)=>{
        console.log(result)
        if(result.deletedCount == 1)
        {

            res.status(202).send({status : 202 , message : "Deleted Successfully"})
        }
        else
        {
            
            res.status(409).send({status : 409 , message : "Not Deleted !! Try Again"})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status : 500 , message : "Something Went Wrong!!"})

    })
}




exports.dummyLogin = (req,res)=>{

    const  user = {
        name : "Bhanu",
        mobile : "9549339982",
        email : "bhanu@gmail.com",
        password : "1234"
    }
    var token  =  jwt.sign({ mobile :  user.mobile} , process.env.PRIVATE_KEY  ,{ expiresIn: "20s" } )
    user['token'] =  token
    res.status(200).send(user)
    
}


exports.ValidateToken = (req,res , next) =>{
    console.log(req.headers)
    const {token} = req.headers;

    jwt.verify(token , process.env.PRIVATE_KEY  , function(err ,auth){
        if(err)
        {
            console.log(err)

            if(err.name  == "TokenExpiredError")
            {
                res.status(401).send({ status:401 , message :  "Your Token has been expired"})

            }
            else if(err.name == "JsonWebTokenError")
            {
                res.status(401).send({ status:401 , message :"Your Token Invalid"})

            }
            else
            {
                res.status(500).send({ status:500 , message :"Something Went Wrong"})

            }
        }
        else
        {
            UserSchema.find({ email : auth.email}).then((f_result)=>{
                if(f_result.length > 0)
                {
                    next() 
                }
                else{
                    res.status(401).send({ status:401 , message :"Your Token Invalid"}) 
                }
            }).catch((err)=>{

                res.status(500).send({ status:500 , message :"Seomthing Went Wrong"})
            })

            
        }
    })



}


exports.checkOddEven = (req,res)=>{


    if(parseInt(req.body.num) % 2 == 0)
    {
        res.send("Even Number")
    }
    else
    {
        res.send("Odd Number")

    }

}
























