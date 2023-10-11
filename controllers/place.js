const { mdoels } = require('../models');
const { decodeToken } = require('../middleware');

const getPlaces = async (req, res) => {

  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const result = await models.Place.getPlaces(page, limit);
    const data = result.rows;
    const totalCount = parseInt(data[0].total_count, 10);
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const id = req.params.place_id;
    const result = await models.Place.getPlaceById(id);
    const data = result.rows[0];
    res.status(200).send(data);
  } catch (error) {
    console.error('Error retrieving place data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getPlaces, getPlaceById };
