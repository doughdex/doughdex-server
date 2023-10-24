const admin = jest.createMockFromModule('firebase-admin/auth');

admin.getAuth = jest.fn().mockImplementation(() => ({
  verifyIdToken: jest.fn().mockImplementation((token) => {
    if (token === 'user1Token') {
      return Promise.resolve({ uid: 'user1', email: 'john.doe@example.com' });
    } else if (token === 'user2Token') {
      return Promise.resolve({ uid: 'user2', email: 'jane.doe@example.com' });
    } else if (token === 'user3Token') {
      return Promise.resolve({ uid: 'user3', email: 'bob.smith@example.com' });
    } else if (token === 'archivedUserToken') {
      return Promise.resolve({ uid: 'user4', email: 'alice.johnson@example.com' });
    } else if (token === 'user10Token') {
      return Promise.resolve({ uid: 'user10', email: 'hannah.brown@example.com' });
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