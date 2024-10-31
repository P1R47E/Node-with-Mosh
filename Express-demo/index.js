const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('db:startup')
const config =  require('config')
const helmet = require('helmet');
const morgan = require('morgan')
const Joi = require("joi");
const authenticator = require('./authenticator')
const logger = require('./logger')

const express = require("express");
const app = express()

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded( {extended:true} ));
app.use(express.static('./public'));
app.use(logger)
app.use(authenticator)

console.log('Application name: ' + config.get('name'));
console.log('Mail server: '+ config.get('mail.host'))
// console.log('Mail password: ' + config.get('mail.password'))
if(app.get('env')==='development'){
    app.use(morgan('tiny'))
    startupDebugger("morgan enabled");
}
dbDebugger("connected to the database")
const courses = [
    {id:1,name:"course1"},
    {id:2,name:"course2"},
    {id:3,name:"course3"},
]
app.get('/api/courses', (req,res) =>{
    res.status(200).send(courses)
})

app.get ('/api/courses/:id',(req,res)  => {
   const course = courses.find(c => c.id === parseInt (req.params.id))
   if(!course) return res.status(404).send("the course of the Id hasn't been found")
   res.send(course);
})

app.post('/api/courses', (req,res) => {
    const {error} = validateCourses(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course)
    res.status(201).send(course)

})

app.put('/api/courses/:id', (req,res)=>{
    //look up the course
    //if not existing return 404
   const course = courses.find(c => c.id === parseInt (req.params.id))
   if(!course) return res.status(404).send("the course of the Id hasn't been found")

    //validate
    //if invalid return 400 bad request

    const {error} = validateCourses(req.body)
    if (error){
         return res.status(400).send(error.details[0].message)}

    //update the course
    course.name = req.body.name;
    //return the updated course
    res.send(course)
})

function validateCourses(course){
    const schema = Joi.object({
        name:Joi.string().min(3).required()
    });
    return schema.validate(course)   
}

app.delete('/api/courses/:id',(req,res) => {
    //check if the course exist
   const course = courses.find(c => c.id === parseInt (req.params.id))
   if(!course) return res.status(404).send("the course of the Id hasn't been found")

    const index = courses.indexOf(course);
    courses.splice(index,1)
    res.send(course)
})


const port= process.env.PORT || 3000
app.listen (port,() => console.log(`port listening on ${port}`));