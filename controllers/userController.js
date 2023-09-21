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

const updateUser = (req, res) => {

};

const deleteUser = (req, res) => {

};

const getUserLists = (req, res) => {

};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLists
};