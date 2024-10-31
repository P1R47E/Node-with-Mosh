function authent(req,res,next)
{
    console.log("authenticate")
    next()
}

module.exports = authent