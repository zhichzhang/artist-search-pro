const axios = require('axios');
const moment = require('moment');
const querystring = require('querystring');

const CLIENT_INFO = {
    client_id: "9d5e54d025275668d6ee",
    client_secret: "1e989aa11dbe46c73a39468d55342842"
};

let CURRENT_TOKEN = {
    type: "xapp_token",
    token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiIzY2RjYjliOS00YmNmLTRjNmItYjhkNy0yZGE4NzIyZmMxNWMiLCJleHAiOjE3NDMxMjA0MTksImlhdCI6MTc0MjUxNTYxOSwiYXVkIjoiM2NkY2I5YjktNGJjZi00YzZiLWI4ZDctMmRhODcyMmZjMTVjIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjY3ZGNhZGEzZGU4YmViMWQzNWRjYzhlYSJ9.xt4RUNwLTbPSoMDbOIhNw0UfZxhN7ST_xEDAlNZlbL8",
    expires_at: "2025-03-13T00:06:59+00:00",
    _links: {}
}

const AUTHENTICATE_API = "https://api.artsy.net/api/tokens/xapp_token?";
const HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'};


function isTokenExpired() {
    const expiredAt = moment(CURRENT_TOKEN.expires_at);
    const now = moment();
    return now.isAfter(expiredAt);
}


async function getArtsyToken(expired){
    if (isTokenExpired()){
        const body = querystring.stringify({
            client_id: CLIENT_INFO.client_id,
            client_secret: CLIENT_INFO.client_secret
        });
        try{
            console.log("Invalid token.");
            const response = await axios.post(AUTHENTICATE_API, body, { headers: HEADERS });

            console.log(response.data);
            CURRENT_TOKEN = response.data;
            return CURRENT_TOKEN.token;
        } catch(error){
            console.error(error.message)
        }

    }
    console.log("Valid token.");
    return CURRENT_TOKEN.token;
}


module.exports = { getArtsyToken }