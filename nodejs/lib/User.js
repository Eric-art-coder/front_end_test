var db = require('./db');
var Promise = require('bluebird');

/**
 * Get user by its id
 *
 * @param  {integer} id - User ID
 * @return {Promise} resolves User object
 */
function getUserById (userId) {
  return new Promise(function (resolve, reject) {
    db.findOne({ type: 'User', id: userId }, function (err, userDoc) {
      if (err) reject(err);
      if (!userDoc) reject(new Error('User not found'));
      resolve(userDoc);
    })
  });
}

/**
 * Get all projects of a user
 *
 * @param  {object} user - User object
 * @return {Promise} resolves Project object array
 */
function getUserProjects (user) {
  return new Promise(function (resolve, reject) {
    db.find({ type: 'Project', user_id: user.id }, function (err, projectDocs) {
      if (err) reject(err);
      resolve(projectDocs);
    });
  });
}

module.exports = {
  getUserById: getUserById,
  getUserProjects: getUserProjects
}
