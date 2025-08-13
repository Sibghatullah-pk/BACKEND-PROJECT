const express =require('express')
const app=express()

app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs")
app.use(function(req, res, next) {
    res.locals.errors = []
    next()
})

app.get("/", (req, res) => {
res.render("homepage")
app.use(express.static("public"))
})

app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/register", (req, res) => {
    const errors= []

    if(typeof req.body.username !== 'string' )
        req.bosy.username = ''
    if(typeof req.body.password !== 'string' )
        req.body.password = ''
    req.body.username=  req.body.username.trim()
    req.body.password=  req.body.password.trim()
    if(req.body.username.trim() === '')
        errors.push("Username is required")
     if(errors.length > 0) {
        res.render("register", { errors: errors, username: req.body.username })
        return
    }   else{
        console.log("Username:", req.body.username);
        console.log("Password:", req.body.password);
        // Here you would typically save the user to a database
        // For this example, we just log it to the console  
    }
    res.send("Registration successful");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})
