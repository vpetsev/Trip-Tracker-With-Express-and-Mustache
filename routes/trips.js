const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    const personalTrips = allTrips.filter(item => item.username === req.session.username)
    res.render("trips", { listOfTrips: personalTrips })
})

function createTrip(req, res) {
    const { title, image, departureDate, returnDate } = req.body
    allTrips.push({ title, image, departureDate, returnDate, username: req.session.username })
    res.redirect("/trips")
}
router.post("/", createTrip)
router.createTrip = createTrip
module.exports = router
