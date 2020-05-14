const express = require("express")
const app = express()
const mustacheExpress = require("mustache-express")
const tripRouter = require("./routes/trips")
let session = require("express-session")

global.allTrips = []
global.users = [{username: "john", password: "password"},{username: "asdf", password: "asdf"}]

// MIDDLEWARE
app.use(express.urlencoded()) // for parsing form submitted data 

// initialize the session
app.use(session({
    secret: "keyboard cat",
    resave: false, 
    saveUninitialized: true
}))

app.use("/trips", authenticate, tripRouter)

function authenticate(req, res, next) {
    if (req.session) {
        if(req.session.isAuthenticated){
            console.log("AUTHENTICATED")
            console.log(req.session.username)
            next()
        } else {
            console.log("not authenticated")
            res.redirect("login")
        }
    } else {
        console.log("not authenticated")
    }
}

// END MIDDLEWARE

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/index", (req, res) => {
    console.log("post fired")
    let title = req.body.title
    let image = req.body.image
    let departureDate = req.body.departureDate
    let returnDate = req.body.returnDate
    
    req.body.username = currentUser

    let trip = {
        title: title,
        image: image,
        departureDate: departureDate,
        returnDate: returnDate,
        username: user
    }
    console.log(trip + "trip")
    
    allTrips.push(trip)

    res.redirect("/trips")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    if (users.some(u => u.username == username) === false){
        users.push({username: username, password: password})
        res.redirect("login")
    } else {
        console.log("A user already has thtat username")
    }
})

app.get("/login", (req, res)=> {
    res.render("login")
})

app.post("/login", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    let tempUser = users.find(u => {
        return (u.username == username && u.password == password)
    })
    console.log(tempUser)

    if (tempUser) {
        if (req.session) {
            req.session.isAuthenticated = true
            req.session.username = tempUser
            res.redirect("/")
        } else {
            console.log("invalid login")
            res.redirect("/login")
        }
    } else {
        console.log("invalid user")
        res.redirect("/login")

    }
})

app.engine("mustache", mustacheExpress())
// the pages are located in views directory
app.set("views", "./views")
// extension will be .mustache
app.set("view engine", "mustache")

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})