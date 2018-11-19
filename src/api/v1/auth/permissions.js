const permissions = [{
  "roles": ["visitor"],
  "allows": [{
    "resources": ["/v1/auth/login", "/v1/user", "/v1/user/:id/session"
    ],
    "permissions": ["post"]
  }]
},
{
  "roles": ["user", "admin", "professor"],
  "allows": [{
    "resources": [
      "/v1/user/:id/session", "/v1/auth/login", "/v1/user", "/v1/classes",
      "/v1/signup/user/:userId/class/:classId", 
      "/v1/class/:classId/assignments"
    ],
    "permissions": ["get"]
  }]
},
{
  "roles": ["professor"],
  "allows": [{
    "resources": [
      "/v1/class", "/v1/assignment",
      "/v1/class/:classId/assignment"
    ],
    "persmissions": ["post"]
  }]
},
{
  "roles": ["professor"],
  "allows": [{
    "resources": [
      "/v1/class",
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
