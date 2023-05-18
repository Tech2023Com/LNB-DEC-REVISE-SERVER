
const path  = require('path')


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