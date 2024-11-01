const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('db:startup')
const config =  require('config')
const helmet = require('helmet');
const morgan = require('morgan')
const Joi = require("joi");
const authenticator = require('./authenticator')
const logger = require('./middleware/logger.js')
const courses = require('./routes/courses.js')
const home = require('./routes/home.js')

const express = require("express");
const app = express()

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded( {extended:true} ));
app.use(express.static('./public'));
app.use(logger)
app.use(authenticator)
app.use('/api/courses',courses)
app.use('/',home)

app.set('view engine','pug')
app.set('views', './views')

console.log('Application name: ' + config.get('name'));
console.log('Mail server: '+ config.get('mail.host'))
// console.log('Mail password: ' + config.get('mail.password'))
if(app.get('env')==='development'){
    app.use(morgan('tiny'))
    startupDebugger("morgan enabled");
}
dbDebugger("connected to the database")



const port= process.env.PORT || 3000
app.listen (port,() => console.log(`port listening on ${port}`));