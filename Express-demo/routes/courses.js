const express = require('express');
const router = express.Router()

const courses = [
    {id:1,name:"course1"},
    {id:2,name:"course2"},
    {id:3,name:"course3"},
]

router.get('/', (req,res) =>{
    res.status(200).send(courses)
})

router.get ('/:id',(req,res)  => {
   const course = courses.find(c => c.id === parseInt (req.params.id))
   if(!course) return res.status(404).send("the course of the Id hasn't been found")
   res.send(course);
})

router.post('/', (req,res) => {
    const {error} = validateCourses(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course)
    res.status(201).send(course)

})

router.put('/:id', (req,res)=>{
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

router.delete('/:id',(req,res) => {
    //check if the course exist
   const course = courses.find(c => c.id === parseInt (req.params.id))
   if(!course) return res.status(404).send("the course of the Id hasn't been found")

    const index = courses.indexOf(course);
    courses.splice(index,1)
    res.send(course)
})

module.exports= router;
