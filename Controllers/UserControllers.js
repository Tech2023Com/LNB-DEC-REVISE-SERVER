
const path  = require('path')
const UserSchema = require('../Schemas/UserSchema')


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

    UserSchema.insertMany({name : name ,  email :  email ,  mobile : mobile ,  password :  password }).then((result)=>{
console.log(result)
res.status(200).send({status : 200 ,  message : "User Created Successfully"})
    }).catch((err)=>{
        console.log(err.name)
        console.log(err.message)
        if(err.name ==  "ValidationError")
        {
            res.status(400).send({ status : 400, message : `${err.message.split(":")[1].trim()} Cannot be Empty ): `})
        }
        else if(err.name == "MongoBulkWriteError")
        {

                let key  = err.message.split(":")[3].replace("{" , "").trim()
                let value  = err.message.split(":")[4].replace("}" , "").trim()
        res.status(400).send({ status :  400, message : `User , with this ${key} (${value}) already exists ):`})
        }
        else{

            res.status(500).send({ status : 500, message : "Something Went Wrong" , err : err})
        }
    })

} 