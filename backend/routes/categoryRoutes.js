const express = require('express');
const axios = require('axios');
const { getArtsyToken } = require('../utils/artsyTokenGetter');

const router = express.Router();

const CATEGORY_API = "https://api.artsy.net/api/genes?";

router.get('/:artworkId', async (req, res) => {
    const { artworkId } = req.params;

    const CATEGORY_URL = CATEGORY_API + `artwork_id=${artworkId}`;


    try{
        const X_XAPP_Token = await getArtsyToken();
        const config = {
            headers:{
                "Content-Type": "application/json",
                "X-XAPP-Token": X_XAPP_Token
            }
        };
        console.log(X_XAPP_Token);
        const response = await axios.get(CATEGORY_URL, config);
        const data = response.data;
        console.log(data);
        const genes = data._embedded.genes;
        let  filtered_genes = [];
        genes.forEach(gene =>{
           let filtered_gene = {
               categoryName: gene.name,
               categoryThumbnailHref: gene._links.thumbnail.href
           };
           filtered_genes.push(filtered_gene);
        });
        res.status(200).json({
            message: 'Retrieved the genes for the given artwork successfully.',
            success: true,
            data: {
                _embedded: filtered_genes
            }
        });
    } catch(err){
        res.status(404).json({
            message: "An unexpected error occurred",
            success: false
        })
    }

});

module.exports = router;