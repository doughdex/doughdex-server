const { models } = require('../models');
const { decodeToken } = require('../middleware');
const { createPaginationLinks, isUserVisible, isListOwner, isUniqueInList } = require('./helpers');

const getLists = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) >= 1 ? req.query.page : 1;
    const limit = parseInt(req.query?.limit) >= 1 ? req.query.limit : 10;
    const result = await models.List.getLists(page, limit);
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
    console.error('Error retrieving lists:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getListById = async (req, res) => {

  if (!parseInt(req.params.list_id)) {
    res.status(404).json({ message: 'List Not Found' });
    return;
  }

  try {
    const result = await models.List.getListById(req.params.list_id);

    if (result.rows.length === 0 || result.rows[0].is_archived || result.rows[0].is_flagged) {
      res.status(404).json({ message: 'List Not Found' });
      return;
    }
    const data = result.rows[0];

    const isVisible = await isUserVisible(data.user_id);

    if ((!isVisible && req.user?.id !== data.user_id) || (data.is_private && req.user?.id !== data.user_id)) {
        res.status(404).json({ message: 'List Not Found' });
        return;
    }

    res.status(200).send(data);
  } catch (error) {
    console.error('Error retrieving list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createList = async (req, res) => {

  if (!req.body || !req.body.listName) {
    res.status(400).json({ message: 'Bad Request' });
    return;
  }

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
  const userId = req.user.id;
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

    if (queryParts.length === 0) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }

    const result = await models.List.updateList(userId, listId, queryParts, queryValues);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'List Not Found' });
      return;
    }

    const data = result.rows[0];
    res.status(200).send(data);
  } catch (error) {
    console.error('Error updating list', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteList = async (req, res) => {

  const isOwner = await isListOwner(req.user.id, req.params.list_id);

  if (!isOwner) {
    res.status(404).json({ message: 'List Not Found' });
    return;
  }

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

  if (!parseInt(req.params.list_id) || !req.body || !req.body.place_id) {
    res.status(400).json({ message: 'Bad Request' });
    return;
  }

  const isOwner = await isListOwner(req.user.id, req.params.list_id);

  if (!isOwner) {
    res.status(404).json({ message: 'List Not Found' });
    return;
  }

  const isUnique = await isUniqueInList(req.params.list_id, req.body.place_id);

  if (!isUnique) {
    res.status(400).json({ message: 'Bad Request' });
    return;
  }

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