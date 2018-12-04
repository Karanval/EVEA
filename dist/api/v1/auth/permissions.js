"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const permissions = [{
  "roles": ["visitor"],
  "allows": [{
    "resources": ["/v1/auth/login", "/v1/user", "/v1/user/:id/session"],
    "permissions": ["post"]
  }]
}, {
  "roles": ["user", "admin", "professor"],
  "allows": [{
    "resources": ["/v1/user/:id/session", "/v1/auth/login", "/v1/user", "/v1/classes", "/v1/class/:classId/assignments", "/v1/classes/:userId", "/v1/class/:id"],
    "permissions": ["get"]
  }]
}, {
  "roles": ["user", "admin", "professor"],
  "allows": [{
    "resources": ["/v1/signup/user/:userId/class/:classId", "/v1/assignment"],
    "permissions": ["post"]
  }]
}, {
  "roles": ["professor"],
  "allows": [{
    "resources": ["/v1/class", "/v1/assignment", "/v1/class/:classId/assignment"],
    "permissions": ["post"]
  }]
}, {
  "roles": ["professor"],
  "allows": [{
    "resources": ["/v1/class"],
    "permissions": ["patch", "get"]
  }]
}, {
  "roles": ["admin"],
  "allows": [{
    "resources": ["/v1/user", "/v1/user/:id", "/v1/makeProf/:id", "/v1/nonProfessors"],
    "permissions": ["get", "post"]
  }]
}];

exports.default = permissions;