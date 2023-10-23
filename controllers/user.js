const { models } = require('../models');
const { decodeToken } = require('../middleware');
const { createPaginationLinks, isUniqueUid, isUniqueEmail, isValidEmail, isUserVisible } = require('./helpers');

const getUsers = async (req, res) => {

  try {
    const page = parseInt(req.query?.page) >= 1 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query?.limit) >= 1 ? parseInt(req.query.limit) : 10;
    const result = await models.User.getUsers(page, limit);
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
    }

    res.status(200).send(response);
  } catch (error) {
    console.error('Error retrieving users data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {

  if (!parseInt(req.params.user_id)) {
    res.status(400).json({ message: 'Invalid user id' });
    return;
  }

  try {
    const result = await models.User.getUserById(req.params.user_id);
    const data = result.rows.length ? result.rows[0] : null;

    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!data.is_private || parseInt(req.params.user_id) === req.user?.id) {
      res.status(200).send(data);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {

  if (!req.body.uid || !req.body.email || !req.body.name) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  if (!isValidEmail(req.body.email)) {
    res.status(400).json({ message: 'Invalid email address' });
    return;
  }

  const uniqueUid = await isUniqueUid(req.body.uid);
  const uniqueEmail = await isUniqueEmail(req.body.email);

  if (!uniqueUid) {
    res.status(400).json({ message: 'Uid already in use' });
    return;
  }

  if (!uniqueEmail) {
    res.status(400).json({ message: 'Email already in use' });
    return;
  }

  try {
    const result = await models.User.createUser(req.body);
    const data = result.rows[0];
    res.status(201).send(data);
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.user_id;
  const updateData = req.body;

  if (req.body?.email) {
    if (!isValidEmail(req.body.email)) {
      res.status(400).json({ message: 'Invalid email address' });
      return;
    }

    const uniqueEmail = await isUniqueEmail(req.body.email);

    if (!uniqueEmail) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
  }

  try {
    const queryParts = [];
    const queryValues = [];

    for (const key in updateData) {
      if (key === 'is_admin' || key === 'uid') { continue; }
      queryParts.push(`${key} = $${queryValues.length + 1}`);
      queryValues.push(updateData[key]);
    }

    const result = await models.User.updateUser(userId, queryParts, queryValues);
    const data = result.rows[0];
    res.status(200).send(data);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await models.User.deleteUser(req.params.user_id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserLists = async (req, res) => {

  const isUser = parseInt(req.params.user_id) === parseInt(req.user?.id) ? true : false;
  const userVisibility = await isUserVisible(req.params.user_id);

  if (!isUser && !userVisibility) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  try {
    const page = parseInt(req.query?.page) >= 1 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query?.limit) >= 1 ? parseInt(req.query.limit) : 5;
    const result = await models.User.getUserLists(req.params.user_id, page, limit, isUser);
    const data = result.rows;
    const totalCount = parseInt(data[0]?.total_count, 10) || 0;
    const totalPages = Math.ceil(totalCount / limit) || 0;
    const links = createPaginationLinks(req, page, limit, totalPages);

    const response = {
      page,
      limit,
      totalCount,
      totalPages,
      links,
      data
    }
    res.status(200).send(response);
  } catch (error) {
    console.error('Error retrieving user\'s lists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLists
};