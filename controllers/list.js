const { models } = require('../models');
const { decodeToken } = require('../middleware');
const { createPaginationLinks } = require('./helpers');

const getLists = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const result = await models.List.getLists(page, limit);
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
    console.error('Error retrieving lists:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getListById = async (req, res) => {
  // Todo: If a list is private, only return if requested by list creator
  try {
    const result = await models.List.getListById(req.params.list_id);
    const data = result.rows[0];
    res.status(200).send(data);
  } catch (error) {
    console.error('Error retrieving list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createList = async (req, res) => {
  try {
    const userId = req.user.id;
    const listName = req.body.listName;

    const result = await models.List.createList(userId, listName);
    const data = result.rows[0];
    res.status(201).send(data);
  } catch (error) {
    console.error('Error creating list', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateList = async (req, res) => {
  const listId = req.params.list_id;
  const updateData = req.body;

  try {
    const queryParts = [];
    const queryValues = [];

    for (const key in updateData) {
      if (key === 'is_flagged') { continue; }
      queryParts.push(`${key} = $${queryValues.length + 1}`);
      queryValues.push(updateData[key]);
    }

    const result = await models.List.updateList(listId, queryParts, queryValues);
    const data = result.rows[0];
    res.status(200).send(data);
  } catch (error) {
    console.error('Error updating list', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteList = async (req, res) => {
  try {
    const listId = req.params.list_id;
    await models.List.deleteAllSpotsFromList(listId);
    await models.List.deleteList(listId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting list', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

};

const addSpotToList = async (req, res) => {
  try {
    const listId = req.params.list_id;
    const placeId = req.body.place_id;
    const result = await models.List.addSpotToList(listId, placeId);
    const data = result.rows[0];
    res.status(201).send(data);
  } catch (error) {
    console.error('Error adding spot to list', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const removeSpotFromList = async (req, res) => {
  try {
    const placeId = req.params.spot_id;
    const listId = req.params.list_id;
    await models.List.removeSpotFromList(listId, placeId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting spot from list', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateSpotInList = () => {

};

module.exports = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  addSpotToList,
  removeSpotFromList,
  updateSpotInList,
}