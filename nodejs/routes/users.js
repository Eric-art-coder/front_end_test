var express = require('express');
var router = express.Router();
var User = require('../lib/User');
var Promise = require('bluebird');

var middlewares = {
  getUserById: function (req, res, next) {
    var userId = parseInt(req.params.id, 10);
    var userPromise = User.getUserById(userId);
    req.user = userPromise;
    next();
    return req.user;
  },

  getProjectsForUser: function (req, res, next) {
    var projectsPromise = req.user.then(function (user) {
      return User.getUserProjects(user);
    }, next);
    req.projects = projectsPromise;
    next();
    return req.projects;
  },

  responseUserWithProjects: function (req, res, next) {
    return Promise.all([
      req.user,
      req.projects
    ]).then(function (results) {
      var user = results[0];
      user.projects = results[1];
      res.json(user);
    }, next);
  }
}

router.get('/:id',
  middlewares.getUserById,
  middlewares.getProjectsForUser,
  middlewares.responseUserWithProjects
);

module.exports = {
  router: router,
  middlewares: middlewares
}
