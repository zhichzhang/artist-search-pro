const express = require("express");
const axios = require("axios");
const { getArtsyToken } = require("../utils/artsyTokenGetter");

const router = express.Router();

const ARTISTS_API = "https://api.artsy.net/api/artists";
const SIMILAR_ARTISTS_API = "https://api.artsy.net/api/artists?";


router.get('/:artistId', async (req, res) => {
    const{artistId} = req.params;

    const ARTISTS_URL = ARTISTS_API + `/${artistId}`;
    try {
        const X_XAPP_Token = await getArtsyToken();
        const config = {
            headers:{
                "Content-Type": "application/json",
                "X-XAPP-Token": X_XAPP_Token
            }
        };
        const response = await axios.get(ARTISTS_URL, config);
        // console.log(response.data);
        const data = response.data;
        const name = data.name;
        const birth_day = data.birthday;
        const death_day = data.deathday;
        const nationality = data.nationality;
        const biography = data.biography;
        res.status(200).json({
            message: `Retrieved the info of an artist successfully`,
            success: true,
            data: {
                name: name,
                birthday: birth_day,
                deathday: death_day,
                nationality: nationality,
                biography: biography
            }
        });
    } catch (err) {
        res.status(500).send({
            message: 'An unexpected error occurred.',
            success: false,
            error: err.message
        });
    }

});

router.get('/similar/:similarToArtistId', async (req, res) => {
    const {similarToArtistId} = req.params;

    const SIMILAR_ARTISTS_URL = SIMILAR_ARTISTS_API + `similar_to_artist_id=${similarToArtistId}&similarity_type=contemporary`;

    try{
        const X_XAPP_Token = await getArtsyToken();
        const config = {
            headers:{
                "Content-Type": "application/json",
                "X-XAPP-Token": X_XAPP_Token
            }
        };
        const response = await axios.get(SIMILAR_ARTISTS_URL, config);
        // console.log(response);
        const data = response.data;
        const similar_artists = data._embedded.artists;
        let filtered_similar_artists = [];
        similar_artists.forEach(artist => {
            let item = {
                artistId: artist.id,
                artistName: artist.name,
                artistThumbnailHref: artist._links.thumbnail.href
            };
            filtered_similar_artists.push(item);
        });
        res.status(200).json({
            message: "Retrieved similar artists successfully!",
            success: true,
            data: {
                _embedded: filtered_similar_artists
            }
        });
    }catch(err){
        res.status(500).send({
            message: 'An unexpected error occurred.',
            success: false
        })
    }
});

module.exports = router;