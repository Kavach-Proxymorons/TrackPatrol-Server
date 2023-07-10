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
  },
  {
    name: 'Personnel',
    description: 'Personnel endpoints'
  }
  ],
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
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
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
    "Resource not found": {
      success: false,
      status: 404,
      message: "Resource not found",
      stack: ""
    },
    "Authenticated": {
      success: true,
      status: 200,
      message: "Authorized",
      data: {
        _id: '60f0b6b3e6b3a51e3c9f0b1f',
        username: 'shahbaz42',
        name: 'Shahbaz',
        role: 'admin',
        last_login: '2021-07-16T07:25:07.000Z',
        __v: 0
      }
    },
    "Unauthorized": {
      success: false,
      status: 401,
      message: "Unauthorized",
    },
    "Forbidden": {
      success: false,
      status: 403,
      message: "Forbidden",
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
    },
    "Login req.body": {
      $username: "Shahbaz",
      $password: "123456789"
    },
    "Unauthorized incorrect username or password": {
      success: false,
      status: 401,
      message: "Unauthorized : incorrect username or password",
    },
    "Login successful": {
      success: true,
      status: 200,
      message: 'Login successful',
      data: {
        token: "asdfjasldkfjlaskdfjlaskdjfasdffdasdfasdfas",
        expires_in: "30d",
        user: {
          _id: '60f0b6b3e6b3a51e3c9f0b1f',
          username: 'shahbaz42',
          name: 'Shahbaz',
          role: 'admin',
          last_login: '2021-07-16T07:25:07.000Z',
          __v: 0
        }
      }
    },
    /**const personnelSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true,
        unique: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    official_name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    photograph: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    identification_mark: {
        type: String,
        required: true
    },
    posted_at: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}); */
    "create personnel req.body": {
      $sid: "123456789",
      $temp_password: "123456789",
      $official_name: "Shahbaz",
      $designation: "Officer",
      $photograph: "https://www.google.com",
      $dob: "2000-07-16T07:25:07.000Z",
      $blood_group: "A+",
      $identification_mark: "None",
      $posted_at: "Delhi",
      $address: "Delhi"
    },
    "Personnel created successfully response": {
      "success": true,
      "status": 200,
      "message": "Personnel created successfully",
      "data": {
        "sid": "123456789",
        "user": "64aafc98b0370830e5cb5d48",
        "official_name": "Shahbaz",
        "designation": "Officer",
        "photograph": "https://www.google.com",
        "dob": "2000-07-16T07:25:07.000Z",
        "blood_group": "A+",
        "identification_mark": "None",
        "posted_at": "Delhi",
        "address": "Delhi",
        "_id": "64aafc99b0370830e5cb5d4a",
        "__v": 0
      }
    },
    "Personnel bulk creation successful response": {
      "success": true,
      "status": 200,
      "message": "Personnel created successfully",
      "data": {
        "bulk_user_create_result": [
          {
            "username": "101",
            "name": "Shahbaz Ali",
            "password": "123456789",
            "role": "personnel",
            "_id": "64ab5bb1e68088f3e004906e",
            "last_login": "2023-07-10T01:15:29.111Z",
            "__v": 0
          },
        ],
        "bulk_personnel_create_result": [
          {
            "sid": "101",
            "user": "64ab5bb1e68088f3e004906e",
            "official_name": "Shahbaz Ali",
            "designation": "officer",
            "photograph": "https://link.png",
            "dob": "2000-07-16T00:00:00.000Z",
            "blood_group": "B-",
            "identification_mark": "None",
            "posted_at": "Delhi",
            "address": "Delhi",
            "_id": "64ab5bb1e68088f3e0049072",
            "__v": 0
          },
        ]
      }
    },
    "Personnel list response": {
      "success": true,
      "status": 200,
      "message": "Personnel list fetched successfully",
      "data": {
        "personnel": [
          {
            "_id": "64aafded69d38a1c547c36ac",
            "sid": "123456789",
            "user": {
              "_id": "64aafded69d38a1c547c36aa",
              "username": "123456789",
              "name": "Shahbaz"
            },
            "official_name": "Shahbaz",
            "designation": "Officer",
            "photograph": "https://www.google.com",
            "dob": "2000-07-16T07:25:07.000Z",
            "blood_group": "A+",
            "identification_mark": "None",
            "posted_at": "Delhi",
            "address": "Delhi",
            "__v": 0
          }
        ],
        "totalPages": 2,
        "currentPage": "1"
      }
    },
    "Personnel details response": {
      "success": true,
      "status": 200,
      "message": "Personnel fetched successfully",
      "data": {
        "_id": "64ab004508597db7a4e069c1",
        "sid": "1",
        "user": {
          "_id": "64ab004508597db7a4e069bf",
          "username": "1",
          "name": "Monkey"
        },
        "official_name": "Monkey",
        "designation": "jungle patrol",
        "photograph": "https://www.google.com",
        "dob": "2000-07-16T07:25:07.000Z",
        "blood_group": "A+",
        "identification_mark": "None",
        "posted_at": "Delhi",
        "address": "Delhi",
        "__v": 0
      }
    },
    "Personnel not found response": {
      success: false,
      status: 404,
      message: "Personnel not found, please check the sid",
      stack: ""
    },
    "Bulk delete personnel req.body": {
      $sids: ["1", "2", "3"]
    },
    "Personnel deleted in bulk response": {
      "success": true,
      "status": 200,
      "message": "Personnel deleted successfully",
      "data": {
        "personnelDeleteResult": {
          "acknowledged": true,
          "deletedCount": 2
        },
        "userDeleteResult": {
          "acknowledged": true,
          "deletedCount": 2
        }
      }
    },
    "Personnel deleted successfully response": {
      "success": true,
      "status": 200,
      "message": "Personnel deleted successfully",
      "data": {
        "personnel": {
          "_id": "64ab2b88aea7531ce0825efd",
          "sid": "2",
          "user": "64ab2b88aea7531ce0825efb",
          "official_name": "Shahbaz",
          "designation": "Officer",
          "photograph": "https://www.google.com",
          "dob": "2000-07-16T07:25:07.000Z",
          "blood_group": "A+",
          "identification_mark": "None",
          "posted_at": "Delhi",
          "address": "Delhi",
          "__v": 0
        },
        "user": {
          "_id": "64ab2b88aea7531ce0825efb",
          "username": "2",
          "name": "Shahbaz",
          "role": "personnel",
          "last_login": "2023-07-09T21:50:00.139Z",
          "__v": 0
        }
      }
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
  await import('./bin/www.js');
});