
require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {authenticateToken} = require('./utilities');
const User = require('./models/user.model');
const TravelStory = require('./models/travelStory.model');
const upload = require('./multer');
const fs = require("fs");
const path = require("path");
const { error } = require('console');

mongoose.connect(config.connectionString);

// // MongoDB connection options
// const mongooseOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: {
//       version: '1',
//       strict: true,
//       deprecationErrors: true
//     }
// };

// // MongoDB connection with error handling
// mongoose.connect(config.connectionString, mongooseOptions)
//     .then(() => console.log('Connected to MongoDB successfully'))
//     .catch(err => {
//       console.error('MongoDB connection error:', err);
//       process.exit(1);
// });

// // Add connection event handlers
// mongoose.connection.on('error', err => {
//   console.error('MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('MongoDB disconnected');
// });

// mongoose.connection.on('connected', () => {
//   console.log('MongoDB connected');
// });

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));


// -----------------------------------Create Account-----------------------------------


// Create Account.
app.post("/create-account", async (req, res) => {
    const {fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
        return res
        .status(400)
        .json({error: true, message: "All fields are required."});
    }

    const isUser = await User.findOne({email});
    if (isUser) {
        return res
        .status(400)
        .json({error: true, message: "User already exists."});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        fullName,
        email,
        passwordHash: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: {fullName: user.fullName, email: user.email},
        accessToken,
        message: "Registration successful.",
    });
 
});



// -----------------------------------Login-----------------------------------



// Login.
app.post("/login", async (req, res) => { 
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Email and Password are required" });
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(400).json({message: "Invalid password"});
    }

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.json({
        error: false,
        message: "Login successful",
        user: {fullName: user.fullName, email: user.email},
        accessToken,
    });

});



// -----------------------------------Get User-----------------------------------

// Get User.
app.get("/get-user",authenticateToken , async (req, res) => {

    const {userId} = req.user;
    const isUser = await User.findOne({_id: userId});

    if(!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });

});


// -----------------------------------Add-TravelStory-----------------------------------

// Add Travel Story.
app.post("/add-travel-story", authenticateToken, async (req, res) => {

    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body;
    const {userId} = req.user;

    // validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({message: "All fields are required."});
    }

    // Convert visitedDate from milliseconds to Date object.
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();
        res.status(201).json({story: travelStory, message: "Added Successfully"});
    }
    catch(error){
        res.status(400).json({error: true, message: error.message});
    }

});


// ------------------------------GetAllTravelStories-----------------------------------


// Get All Travel Stories.
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const {userId} = req.user;

    try{
        const travelStories = await TravelStory.find({userId: userId}).sort({
            isFavorite: -1,
        });
        res.status(200).json({stories: travelStories});
    }
    catch(error){
        res.status(400).json({error: true, message: error.message});
    }
});


// -----------------------------------ImgUpload---------------------------------------


// ROute to handle image uplod
app.post("/image-upload", upload.single("image"), async(req, res) => {
    try{
        if(!req.file){
            return res
                .status(400)
                .json({error: true, message: "No image uploaded."});
        }

        const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;

        res.status(200).json({imageUrl});
    }
    catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});


// -----------------------------------Get-dir-image--------------------------------------

// serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// -----------------------------------Delete-Image-------------------------------------


// Route to handle image deletion
app.delete("/delete-image", async (req, res) => {
    const {imageUrl} = req.query;

    if (!imageUrl){
        return res
            .status(400)
            .json({error: true, message: "imageUrl parameter is required."});
    }

    try{
        // Extract the file name from the imageUrl
        const filename = path.basename(imageUrl);

        // Define the file path
        const filePath = path.join(__dirname, 'uploads', filename);

        // check if file exists
        if(fs.existsSync(filePath)){
            // Delete the file from the uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({message: "Image deleted Successfully"});
        }
        else{
            res.status(200).json({error: true, message: "Image not found"});
        }
    }
    catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});


// -----------------------------------Edit-TravelStory-----------------------------------


// Edit Travel Story.
app.put("/edit-story/:id", authenticateToken , async (req, res) => {
    const {id} = req.params;
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body;
    const {userId} = req.user;

    // validate required fields
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({error: true, message: "All fields are required."});
    }

    // Convert visitedDate from milliseconds to Date object.
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        // find story and authenticate the user and then edit it

        const travelStory = await TravelStory.findOne({_id: id, userId: userId});

        if(!travelStory){
            return res.status(400).json({error: true, message: "Story not found"});
        }

        const placeholderImgUrl = `http://localhost:8080/assets/placeholder.jpeg`;

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImgUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({story: travelStory, message: "Updated Successfully"});

    }
    catch(error){
        res.status(200).json({error: true, message: error.message});
    }

});


// --------------------------------Delete-TravelStory-----------------------------------


// Delete Travel Story.
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const {id} = req.params;
    const {userId} = req.user;

    try{
        // find story and authenticate the user and then delete it
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});

        if(!travelStory){
            return res.status(400).json({error: true, message: "Story not found"});
        }

        // Delete the file pathtavel story from database
        await travelStory.deleteOne({_id: id, userId: userId});
        
        // Extract the filename from the imageUrl
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);

        // Define the file path
        const filePath = path.join(__dirname, "uploads", filename);

        // Delete the image file from the uploads folder
        fs.unlinkSync(filePath, (err) =>{
            if(err){
                console.error("Failed to delete image file: ", err);
            }
        })
        res.status(200).json({message: "Story Deleted Successfully"});
    }
    catch(error){
        res.status(400).json({error: true, message: error.message});
    }
});


// -----------------------------------Favorite-TravelStory-----------------------------------


// Favorite Travel Story.
app.put("/update-is-favorite/:id", authenticateToken, async (req, res) => {
    const {id} = req.params;
    const {userId} = req.user;
    const {isFavorite} = req.body;

    try{
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});

        if(!travelStory){
            return res.status(400).json({error: true, message: "Travel Story not found"});
        }

        travelStory.isFavorite = isFavorite;

        await travelStory.save();
        res.status(200).json({story: travelStory, message: "Updated Successfully"});
    }
    catch(error){
        res.status(400).json({error: true, message: error.message});
    }
});


// -----------------------------------Search-Story-----------------------------------


// Search Story.
app.get("/search", authenticateToken, async (req, res) => {
    const {userId} = req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({error: true, message: "Query parameter is required."});
    }

    try{
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                {title: {$regex: query, $options: "i"}},
                {story: {$regex: query, $options: "i"}},
                {visitedLocation: {$regex: query, $options: "i"}},
            ],
        }).sort({isFavorite: -1});

        res.status(200).json({stories: searchResults});
    }
    catch(error){
        res.status(400).json({error: true, message: error.message});
    }
});


// ----------------------------------Filter-Story-----------------------------------


// Filter Story by Dates.
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {

    const {userId} = req.user;
    const {startDate, endDate} = req.query;

    try{
        // Convert startDate and endDate from milliseconds to Date objects.
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // Fiter within range
        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: {$gte: start,$lte: end},
        }).sort({isFavorite: -1});

        res.status(200).json({stories: filteredStories});
    }
    catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});


app.listen(8080);
module.exports = app;