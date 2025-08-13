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
    if (req.body.username === '') {
    errors.push("Username is required");
} else if (!/^[a-zA-Z0-9_]+$/.test(req.body.username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
} else if (req.body.username.length < 3) {
    errors.push("Username must be at least 3 characters");
}

// Password validation
if (req.body.password === '') {
    errors.push("Password is required");
} else if (req.body.password.length < 6) {
    errors.push("Password must be at least 6 characters");
} else if (!/[a-zA-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password)) {
    errors.push("Password must contain at least one letter and one number");
}

     if(errors.length > 0) {
        res.render("homepage", { errors})
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
