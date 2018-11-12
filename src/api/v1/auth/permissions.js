const permissions = [{
  "roles": ["visitor"],
  "allows": [{
    "resources": ["/v1/login", "/v1/user", "/v1/user/:id/session"
    ],
    "permissions": ["post"]
  }]
},
{
  "roles": ["user", "admin"],
  "allows": [{
    "resources": [
      "/v1/user/:id/session", "/v1/login", "/v1/user"
    ],
    "permissions": ["get"]
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
