const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const { title } = require('process');
const ejsMate = require("ejs-mate");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/stayvista";

main().then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log(err);
})

async function main() {
    mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Homepage");
});


//GET all listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


//Create new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Create Route
//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// app.get("/testListings", async (req, res)=>{  
//     let sampleListing = new Listing({
//         title: "My Home Bhooja",
//         description: "In the heart of Hitech city",
//         price: 3000,
//         location: "Hyderabad",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful Testing");
// });





app.listen(8080, () => {
    console.log("App started on server port 8080");
});