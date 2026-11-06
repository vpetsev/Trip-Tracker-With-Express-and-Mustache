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
    if (req.session && req.session.isAuthenticated) return next()
    return res.redirect("/login")
}

// END MIDDLEWARE

app.get("/", (req, res) => {
    res.render("index")
})

// Keep the original endpoint working; both forms use the same session-owned creation.
app.post("/index", authenticate, tripRouter.createTrip)

app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    if (users.some(u => u.username == username) === false){
        users.push({username: username, password: password})
        res.redirect("/login")
    } else {
        res.status(409).render("register", { error: "That username is already registered." })
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

    if (tempUser) {
        if (req.session) {
            req.session.isAuthenticated = true
            req.session.username = tempUser.username
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

if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Trip server started")
    })
}
module.exports = app
