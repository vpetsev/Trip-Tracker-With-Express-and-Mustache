const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')

// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustache
app.set('view engine', 'mustache')

let allTrips = []

app.use(express.urlencoded()) // for parsing form submitted data 


app.get('/', (req, res) => {
    res.render('index')
})

app.post('/trips', (req, res) => {

    let title = req.body.title
    let image = req.body.image
    let departureDate = req.body.departureDate
    let returnDate = req.body.returnDate

    let trip = {
        title: title,
        image: image,
        departureDate: departureDate,
        returnDate: returnDate
    }
    console.log(trip)
    allTrips.push(trip)
    res.redirect('/trips')
})

app.get('/trips', (req, res) => {
    res.render('trips', { listOfTrips: allTrips })
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})