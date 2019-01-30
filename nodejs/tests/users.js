var should = require('should');
var mocksHttp = require('node-mocks-http');
var usersMiddlewares = require('../routes/users').middlewares;

describe('Users endpoint', function () {
  describe('getUserById middleware', function () {
    it('should have users object attached to request object', function (done) {
      var request = mocksHttp.createRequest({
        params: { id: 1 }
      });
      var response = mocksHttp.createResponse();
      // 传入空的next函数
      usersMiddlewares.getUserById(request, response, function () {})
        .then(function (user) {
          user.should.have.properties(['id', 'name', 'position']);
          done();
        }, done);
      // 更加清晰！
    })
  });

  describe('responseUserWithProjects middleware', function () {
    it('should have user with projects object\'s JSON attached in response', function (done) {
      var request = mocksHttp.createRequest();
      var response = mocksHttp.createResponse();
      request.user = Promise.resolve({"type":"User","id":1,"name":"John Wu","position":"Software Engineer","_id":"UUTpdPICsQSLS5zp"});
      request.projects = Promise.resolve([{"type":"Project","user_id":1,"id":3,"title":"InterU","_id":"QH8MxJKnAsHSwA5X"},
        {"type":"Project","user_id":1,"id":1,"title":"Midway","_id":"UnNJxQ7eopLlWFY1"},
        {"type":"Project","user_id":1,"id":2,"title":"Esther","_id":"gZe3sgOsKxxCXHBA"}
      ]);
      usersMiddlewares.responseUserWithProjects(request, response)
        .then(function () {
          var data = JSON.parse(response._getData());
          data.should.have.properties(['id', 'name', 'position', 'projects']);
          data.projects.should.be.an.instanceOf(Array);
          data.projects.should.have.length(3);
          done();
        }, done)
    });
  });
});
