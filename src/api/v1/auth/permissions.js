const permissions = [{
  "roles": ["visitor"],
  "allows": [{
    "resources": ["/v1/login", "/v1/user", "/v1/user/:id/session"
    ],
    "permissions": ["post"]
  }]
},
{
  "roles": ["user", "admin", "professor"],
  "allows": [{
    "resources": [
      "/v1/user/:id/session", "/v1/login", "/v1/user", "/v1/classes",
      "/v1/signup/user/:userId/class/:classId"
    ],
    "permissions": ["get"]
  }]
},
{
  "roles": ["professor"],
  "allows": [{
    "resources": [
      "/v1/class", "/v1/assignment"
    ],
    "persmissions": ["post"]
  }]
},
{
  "roles": ["user", "admin"],
  "allows": [{
    "resources": [
      "/v1/user/:id/details",
    ],
    "permissions": ["patch"]
  }]
},
{
  "roles": ["admin"],
  "allows": [{
    "resources": ["/v1/user", "/v1/user/:id"],
    "permissions": ["get", "post"]
  }]
},
];

export default permissions;
