const mongoose = require("mongoose");

const userFavoritesSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    artistId: {type: String, required: true},
    createdAt: {type: Date},
    artistName: {type: String},
    birthday: {type: String},
    deathday: {type: String},
    nationality: {type: String},
    artistThumbnailHref: {type: String, default: '/assets/artsy_logo.svg'}
},
    {collection: "user_favorites"});

module.exports = mongoose.model('UserFavorites', userFavoritesSchema);