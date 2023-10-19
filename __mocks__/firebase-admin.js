const admin = jest.createMockFromModule('firebase-admin/auth');

admin.getAuth = jest.fn().mockImplementation(() => ({
  verifyIdToken: jest.fn().mockImplementation((token) => {
    if (token === 'user1Token') {
      return Promise.resolve({ uid: 'user1', email: 'john.doe@example.com' });
    } else if (token === 'user2Token') {
      return Promise.resolve({ uid: 'user2', email: 'jane.doe@example.com' });
    } else if (token === 'validToken') {
      return Promise.resolve({ uid: 'uid123' });
    } else if (token === 'noUser') {
      return Promise.resolve({ uid: 'noUser' });
    } else {
      throw new Error('Invalid token');
    }
  }),
}));

module.exports = admin;