const Joi = require("joi");

const express = require("express");
const app = express()

app.use(express.json())

const courses = [
    {id:1,name:"course1"},
    {id:2,name:"course2"},
    {id:3,name:"course3"},
]
app.get('/api/courses', (req,res) =>{
    res.send(courses)
})

app.get ('/api/courses/:id',(req,res)  => {
   const course = courses.find(c => c.id === parseInt (req.params.id))
   if(!course) return res.status(404).send("the course of the Id hasn't been found")
   res.send(course);
})


app.post('/api/courses', (req,res) => {
    const schema =Joi.object({
        name:Joi.string().min(3).required()
    });
    const {error} = schema.validate(req.body)
    if (error){
         return res.status(400).send(error.details[0].message)}
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course)
    res.status(201).send(course)

})



const port= process.env.PORT || 3000

app.listen (port,() => console.log(`port listening on ${port}`));