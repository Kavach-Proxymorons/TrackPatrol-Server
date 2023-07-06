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
    Error : {
      $success: false,
      $status: 500,
      $message: "Internal server error",
      $stack: "Something went wrong"
    },
    Success: {
      $success: true,
      $status: 200,
      $message: "User Registered Successfully",
      $data: {}
    },
  },
  components: {
    schemas: {
      User: {
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