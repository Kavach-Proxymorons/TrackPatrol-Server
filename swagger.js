// Import swagger Autogen
import swaggerAutogen from "swagger-autogen";
swaggerAutogen();

const outputFile = "./docs/swagger_output.json";
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    title: 'Trackpatrol API',
    description: 'API doc Documentation for Trackpatrol',
  },
  tags: [{
    name: 'Auth',
    description: 'Authentication endpoints'
  }],
  servers: [
    {
      url: "http://localhost:3000/",
      description: "local server"
    },
    {
      url: "https://trackpatrol.onrender.com/",
      description: "production server"
    }
  ],
  schemes: ['http'],
  definitions: {
    Success: {
      success: true,
      status: 200,
      message: "Success message",
      data: {}
    },
    "Internal server error": {
      success: false,
      status: 500,
      message: "Internal server error",
      stack: "Something went wrong"
    },
    "Validation error": {
      success: false,
      status: 422,
      message: "Validation error",
      errors: []
    },
    "Registration req.body": {
      $username: "Shahbaz",
      $name: "Shahbaz",
      $password: "123456789",
      $role: "admin"
    },
    "Registration successful": {
      success: true,
      status: 200,
      message: 'User registered successfully',
      data: {
        _id: '60f0b6b3e6b3a51e3c9f0b1f',
        username: 'shahbaz42',
        name: 'Shahbaz',
        password: '123456789',
        role: 'admin',
        last_login: '2021-07-16T07:25:07.000Z',
        __v: 0
      }
    },
    "Username already exists": {
      "success": false,
      "status": 409,
      "message": "Username already exists",
      "stack": "Error: Username already exists ..."
    }

  },
  components: {
    schemas: {
      "User Model": {
        $username: "Shahbaz",
        $name: "Shahbaz",
        $password: "123456789",
        $role: "admin",
        last_login: "2021-07-01T00:00:00.000Z"
      },
    },
  }
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(async () => {
  await import('./app.js');
});