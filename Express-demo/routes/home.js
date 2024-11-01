const express = require('express')
const homeRouter = express.Router()

homeRouter.get('/',(req,res)=>{
    res.render('index',{title:'my express app',message:'i am coding node and i will be good at it'})

})

module.exports = homeRouter;