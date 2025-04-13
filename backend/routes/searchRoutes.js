const express = require("express");
const axios = require("axios");
const { getArtsyToken } = require("../utils/artsyTokenGetter");

const router = express.Router();

const SEARCH_API = "https://api.artsy.net/api/search?";

router.get('/test', (req, res) => {
    res.send('Hello');
})

router.get('/:q', async (req, res) => {
    const {q} = req.params;
    console.log("Received!");
    const X_XAPP_Token = await getArtsyToken();
    const config = {
        headers:{
            "Content-Type": "application/json",
            "X-XAPP-Token": X_XAPP_Token
        }
    };

    try{
        const search_url = SEARCH_API + `q=${q}&type=artist&size=10`;
        const response = await axios.get(search_url, config);
        let filteredArtists = [];
        const embeddedData = response.data._embedded.results;
        embeddedData.forEach((item) => {
            const artistName = item.title || "";
            const artistThumbnailHref = item._links.thumbnail.href || "";
            const artistSelfHref= item._links.self.href || "";
            const theLastPathSegment = artistSelfHref.match(/\/([^\/?#]+)[^\/]*$/);
            const artistId = theLastPathSegment && theLastPathSegment[1]? theLastPathSegment[1] : '';

            const filteredArtistItem = {
                artistId: artistId,
                artistName: artistName,
                artistThumbnailHref: artistThumbnailHref,
                // artist_self_href: artistSelfHref
            };
            filteredArtists.push(filteredArtistItem);
        });
        res.status(200).json({
            message: "Get search result.",
            success: true,
            data: {
                _embedded: filteredArtists
            }
        });
    } catch (err){
        res.status(500).json({
            message: 'An unexpected error occurred.',
            success: false,
            error: err});
    }
});


module.exports = router;