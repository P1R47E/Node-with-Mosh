const express = require("express");
const app = express()

app.get('/',(req,res)=>{
    res.send("Welcome to First Express")
})

// app.get('/api/courses',(req,res) =>{
//     res.send([1,2,3])
// })

app.get ('/api/courses/:id',(req,res)  => {
    res.send(req.params.id)
})

app.get('/api/post/:year/:month',(req,res)=>{
    res.send(req.params)
})

const port= process.env.PORT || 3000

app.listen (port,() => console.log(`port listening on ${port}`));