const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require("../modules/User");
const UserFavorites = require("../modules/UserFavorites");
const { ObjectId } = require("mongodb");
const {getArtsyToken} = require("../utils/artsyTokenGetter");
const axios = require("axios");

const router = express.Router();

const ARTISTS_API = "https://api.artsy.net/api/artists";

const SECRET_KEY = "usc12132345";

router.get('/favorites/:userId/:artistId', async (req, res) => {
  const {userId, artistId} = req.params;
  const userObjId = new mongoose.Types.ObjectId(userId);
  try{
  const userFavorites = await UserFavorites.findOne({userId: userObjId, artistId: artistId});
  if (userFavorites) {
    const deleteUserFavorites = await UserFavorites.deleteOne({userId: userObjId, artistId: artistId});
    if (deleteUserFavorites) {
      console.log(`Remove ${deleteUserFavorites}`);
      res.status(200).json({
        message: "Deleted the user-favorite pair successfully.",
        success: true
      });
    }
  }else{
    const X_XAPP_Token = await getArtsyToken();
    const config = {
      headers:{
        "Content-Type": "application/json",
        "X-XAPP-Token": X_XAPP_Token
      }
    };

    const url = ARTISTS_API + `/${artistId}`;
    const response = await axios.get(url, config);

    const data = response.data;
    const artistName = data.name;
    const birthDay = data.birthday;
    const deathDay = data.deathday;
    const nationality = data.nationality;
    const artistThumbnailHref = data._links?.thumbnail?.href  || "/assets/artsy_logo.svg";

    const newUserFavorites = await UserFavorites.create({
      userId: userObjId,
      artistId: artistId,
      createdAt: new Date(),
      artistName: artistName,
      birthday: birthDay,
      deathday: deathDay,
      nationality: nationality,
      artistThumbnailHref: artistThumbnailHref
    });

    const savedNewUserFavorites = await newUserFavorites.save();

    if (savedNewUserFavorites) {
      console.log(`Added ${savedNewUserFavorites}`);
      res.status(200).json({
        message: "Saved the user-favorite document successfully.",
        success: true
      })
    }
  }
  } catch (err) {
    res.status(500).json({
      message: "An unexpected error occurred.",
      success: false,
      error: err.message
    })
  }
});

router.get('/favorite-list/:userId', async (req, res) => {
  const {userId} = req.params;
  console.log(userId);
  try {
    let favoriteList = [];
    const userObjId = new mongoose.Types.ObjectId(userId);
    console.log(userId);

    const filter = {userId: userObjId};
    const projection = {_id: 0, artistId: 1, createdAt: 1, artistName: 1, birthday: 1, deathday: 1, nationality: 1, artistThumbnailHref: 1};

    let favorites = await UserFavorites.find(filter).select(projection).sort({ createdAt: -1 });

    if (!favorites) {
      return res.status(404).json({
        message: "No record found.",
        success: false
      });
    }

    for (let favorite of favorites) {
      // let artistId = favorite.artistId;
      // let createdAt = favorite.createdAt;
      // console.log(`${artistId}, ${createdAt.toISOString()}`);
      //
      // const url = ARTISTS_API + `/${artistId}`;
      // const response = await axios.get(url, config);
      // // console.log(response.data);
      // const data = response.data;
      // const name = data.name;
      // const birth_day = data.birthday;
      // const death_day = data.deathday;
      // const nationality = data.nationality;
      // const artistThumbnailHref = data._links?.thumbnail?.href  || "/assets/artsy_logo.svg";
      // const row = {
      //   'artistId': artistId,
      //   'artistName': name,
      //   'birthday': birth_day,
      //   'deathday': death_day,
      //   'nationality': nationality,
      //   'createdAt': createdAt.toISOString(),
      //   'artistThumbnailHref': artistThumbnailHref
      // }
      // favoriteList.push(row);
      favorites.createdAt = favorite.createdAt.toISOString();
    }

    res.status(200).json({
      message: "Favorite list found.",
      success: true,
      data: {
        _embedded: favorites
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An unexpected error occurred.",
      success: false,
      error: err.message
    });
  }
});

// ./user/deletes
// Professional realization
// router.delete('/deletes', async (req, res) => {
// const {_id} = req.body;
// Unprofessional realization. Only for the assignment 3.
router.get('/deletes/:userId', async (req, res) => {
  const {userId} = req.params;
  const userObjId = new mongoose.Types.ObjectId(userId);

  try{
    const user = await User.findById(userObjId);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found.`,
        success: false,
      });
    }

    // const deleteFavorites = await UserFavorites.deleteMany(userObjId);
    const deleteFavorites = await UserFavorites.deleteMany({ userId: userObjId });

    if (deleteFavorites.deletedCount > 0) {
      console.log(`Deleted ${deleteFavorites.deletedCount} favorite(s) for user ${userId}.`);
    } else {
      console.log(`No favorites found for user ${userId}.`);
    }
    // if (deleteFavorites.length > 0) {
    // } else {
    //   console.log(`No record found.`);
    // }

    const deleteUser = await User.findByIdAndDelete(userObjId);
    console.log(`Successfully deleted the user ${userId}.`);
    if (deleteUser) {
      res.clearCookie('login_token',{
        path: '/',
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'production',
        secure: false,
        sameSite: 'strict'
      });

      return res.status(200).json({
        message: "Deleted the user successfully.",
        success: true,
      });
    }
  } catch(err){
    res.status(500).json({
      message: "An unexpected error occurred.",
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
