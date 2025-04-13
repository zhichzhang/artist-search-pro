const mongoose = require('mongoose');
// const router = require("./index");
const admin = 'zzhang32';
const password = 'a08173149'

const connectMongoDB = async () => {
    try {
        const mongoURI = `mongodb+srv://${admin}:${password}@assignment3-artist-sear.fp6oz.mongodb.net/assignment3?retryWrites=true&w=majority&appName=assignment3-artist-search-pro`;
        await mongoose.connect(mongoURI, { useNewUrlParser: true });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.log("MongoDB connection error", err);
        process.exit(1);
    }
}

module.exports = connectMongoDB;