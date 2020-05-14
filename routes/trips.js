const express = require("express")
const router = express.Router()

// /trips
router.get("/", (req, res) => {
    console.log(req.session.username)
    let personalTrips = allTrips.filter(item => item.username == req.session.username)
    console.log(personalTrips)
    res.render("trips", { listOfAllTrips: personalTrips })
})

router.post("/", (req, res) => {
    console.log(allTrips)
    res.render("trips")
})


module.exports = router