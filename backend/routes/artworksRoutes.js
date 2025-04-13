const express = require('express');
const axios = require('axios');
const { getArtsyToken } = require('../utils/artsyTokenGetter');

const router = express.Router();

const ARTWORKS_API = "https://api.artsy.net/api/artworks?";

router.get('/:artistId', async (req, res) => {
   const { artistId } = req.params;
   const ARTWORKS_URL =  ARTWORKS_API + `artist_id=${artistId}&size=10`;

   try{
       const X_XAPP_Token = await getArtsyToken();
       const config = {
           headers:{
               "Content-Type": "application/json",
               "X-XAPP-Token": X_XAPP_Token
           }
       };
       console.log(X_XAPP_Token);
       const response = await axios.get(ARTWORKS_URL, config);
       const data = response.data;
       console.log(data);
       const artworks = data._embedded.artworks;
       let filteredArtworks = [];

       artworks.forEach(artwork => {
           let filteredArtworkItem = {
               artworkId: artwork.id,
               artworkTitle: artwork.title,
               artworkDate: artwork.date,
               artworkThumbnailHref: artwork._links.thumbnail.href
           };
           filteredArtworks.push(filteredArtworkItem);
       });

       res.status(200).json({
           message: "Retrieved artworks successfully!",
           success: true,
           data: {
               _embedded: filteredArtworks
           }
       });

   } catch (err){
       res.status(404).json({
           message: "An unexpected error occurred.",
           success: false
       });
   }
});

module.exports = router;