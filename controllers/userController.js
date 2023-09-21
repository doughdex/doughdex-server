const { userModel } = require('../models');
const { decodeToken } = require('../middleware');
const { createPaginationLinks } = require('./helpers');

const getUsers = async (req, res) => {
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
    res.status(501).json({ message: 'Internal server error' });
  }
};

const getUserById = () => {

};

const createUser = () => {

};

const updateUser = () => {

};

const deleteUser = () => {

};

const getUserLists = () => {

};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLists
};