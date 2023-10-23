require('dotenv').config();
const { models } = require('../models');
const { createPaginationLinks } = require('./helpers');
const axios = require('axios');

const getPlaces = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) >= 1 ? req.query.page : 1;
    const limit = parseInt(req.query?.limit) >= 1 ? req.query.limit : 10;
    const result = await models.Place.getPlaces(page, limit);
    const data = result.rows;
    const totalCount = parseInt(data[0]?.total_count, 10) || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const links = createPaginationLinks(req, page, limit, totalPages);

    const response = {
      page,
      limit,
      totalCount,
      totalPages,
      links,
      data
    };

    res.status(200).send(response);
  } catch (error) {
    console.error('Error retrieving places:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const id = req.params.place_id;
    const result = await models.Place.getPlaceById(id);
    const data = result.rows[0];

    if (!data) {
      res.status(404).json({ message: 'Place not found' });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error('Error retrieving place data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getGooglePlacesDetails = async (req, res) => {

  let googlePlacesId = req.params.google_places_id;

  try {
    let response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlacesId}&key=${process.env.GOOGLE_API_KEY}`);
    let data = response.data.result;
    if (!data) {
      res.status(404).json({ message: 'Place not found' });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error('Error retrieving place data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getPlaces, getPlaceById, getGooglePlacesDetails };
