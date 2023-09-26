const { userModel } = require('../models');
const { decodeToken } = require('../middleware');
const { createPaginationLinks } = require('./helpers');

const getUsers = async (req, res) => {
  // TODO: admin should retrieve private and banned users

  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const result = await userModel.getUsers(page, limit);

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
    }

    res.status(200).send(response);
  } catch (error) {
    console.error('Error retrieving users data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  // TODO: Update so if request is made on behalf of user, returns regardless of private status
  try {
    const result = await userModel.getUserById(req.params.user_id);
    const data = result.rows[0];
    res.status(200).send(data);

  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const result = await userModel.createUser(req.body);
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

  if (req.user.id === userId) {
    try {
      const queryParts = [];
      const queryValues = [];

      for (const key in updateData) {
        if (key === 'is_admin' || key === 'is_banned') { continue; }
        queryParts.push(`${key} = $${queryValues.length + 1}`);
        queryValues.push(updateData[key]);
      }

      const result = await userModel.updateUser(queryParts, queryValues);
      const data = result.rows[0];
      res.status(200).send(data);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

const deleteUser = async (req, res) => {
  // Current user or admin only
  if (req.is_admin || req.user.id === req.params.user_id) {
    try {
      await userModel.deleteUser(req.params.user_id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }

};

const getUserLists = async (req, res) => {
  // Should return lists/users that aren't private or banned, if current user is private, should still return their list
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 5;
    const result = await userModel.getUserLists(req.params.user_id, page, limit);

    const data = result.rows;
    const totalCount = parseInt(data[0]?.total_count, 10) || 0;
    const totalPages = Math.ceil(totalCount / limit) || 0;

    const response = {
      page,
      limit,
      totalCount,
      totalPages,
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