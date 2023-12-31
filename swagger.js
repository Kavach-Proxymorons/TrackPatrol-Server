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
    name: 'Admin : Personnel',
    description: 'Personnel endpoints'
  },
  {
    name: 'Admin : Duty',
    description: 'Duty endpoints'
  },
  {
    name: 'Admin : Shift',
    description: 'Shift endpoints'
  },
  {
    name: 'Admin : Hardware',
    description: 'Admin hardware endpoints'
  },
  {
    name: "Hardware",
    description: "Hardware endpoints"
  },
  {
    name: 'App : Duty',
    description: 'App duty endpoints'
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
    },
    {
      url: "https://trackpatrol-server.shahbaz.tech/",
      description: "production server AWS"
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
      message: "Successful",
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
      $police_station: "ghaziabad",
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
    "create personnel req.body": {
      $sid: "123456789",
      $temp_password: "123456789",
      $official_name: "Shahbaz",
      $gender: "male",
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
        "gender": "M",
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
            "gender": "M",
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
              "name": "Shahbaz",
              "gender": "M",
            },
            "official_name": "Shahbaz",
            "gender": "M",
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
          "gender": "M",
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
    },
    "Personnel updated successfully response": {
      "success": true,
      "status": 200,
      "message": "Personnel updated successfully",
      "data": {
        "_id": "64aafded69d38a1c547c36ac",
        "sid": "123456789",
        "user": "64aafded69d38a1c547c36aa",
        "official_name": "Shahbaz",
        "gender": "M",
        "designation": "Officer",
        "photograph": "https://www.google.com",
        "dob": "2000-07-16T07:25:07.000Z",
        "blood_group": "B-",
        "identification_mark": "None",
        "posted_at": "Delhi",
        "address": "Delhi",
        "__v": 0
      }
    },
    "create hardware req.body": {
      "hardware_id": "1",
      "secret": "123456789",
      "name": "uhf rfid unit 1",
      "description": "uhf rfid unit 1",
      "type": "uhf rfid",
      "status": "idle"
    },
    "Hardware created successfully response": {
      "success": true,
      "status": 200,
      "message": "Hardware registered successfully",
      "data": {
        "hardware_id": "2",
        "secret": "123456789",
        "name": "uhf rfid unit 1",
        "description": "uhf rfid unit 1",
        "type": "uhf rfid",
        "status": "idle",
        "_id": "64adad835080ec7a50ea369f",
        "__v": 0
      }
    },
    "Hardware_id already exists response": {
      "success": false,
      "status": 409,
      "message": "Hardware id already exists",
      "stack": ""
    },
    "Hardware fetched successfully response": {
      "success": true,
      "status": 200,
      "message": "Hardware fetched successfully",
      "data": {
        "hardware": [
          {
            "_id": "64ac934f0a1b0e81592ef533",
            "hardware_id": "1",
            "secret": "123456789",
            "name": "uhf rfid unit 1",
            "description": "uhf rfid unit 1",
            "type": "uhf rfid",
            "status": "idle",
            "__v": 0
          }
        ],
        "totalPages": 2,
        "currentPage": "1"
      }
    },
    "Create duty req.body": {
      "title": "Ghaziabad Mela Duty",
      "description": "Ghaziabad Mela Duty",
      "venue": "Ghaziabad",
      "location": "28.6543728,77.409437",
      "police_station": "ghaziabad",
      "start_time": "2025-07-20T07:25:07.000Z",
      "end_time": "2025-07-21T07:25:07.000Z",
      "note": "None",
    },
    "Get all duty res.body": {
      "success": true,
      "status": 200,
      "message": "Duty fetched successfully",
      "data": {
        "duty": [
          {
            "_id": "64adc1982a9b6864cc61b521",
            "title": "Ghaziabad Mela Duty",
            "description": "Ghaziabad Mela Duty",
            "venue": "Ghaziabad",
            "location": "28.6543728,77.409437",
            "start_time": "2025-07-20T07:25:07.000Z",
            "end_time": "2025-07-21T07:25:07.000Z",
            "note": "None",
            "shifts": [],
            "__v": 0
          }
        ],
        "totalPages": 2,
        "currentPage": "1"
      }
    },
    "Get duty res.body": {
      "success": true,
      "status": 200,
      "message": "Duty fetched successfully",
      "data": {
        "_id": "64ae09937175eb1e6e067663",
        "title": "Bycycle Marathon",
        "description": "Annual Bycycle Marathon",
        "venue": "Ghaziabad",
        "location": "28.6543728,77.409437",
        "start_time": "2025-07-20T07:25:07.000Z",
        "end_time": "2025-07-21T07:25:07.000Z",
        "note": "None",
        "shifts": [
          {
            "_id": "64ae09d47175eb1e6e067665",
            "shift_name": "Morning Shift",
            "duty": "64ae09937175eb1e6e067663",
            "start_time": "2025-07-20T07:25:07.000Z",
            "end_time": "2025-07-21T07:25:07.000Z",
            "hardwares_attached": [],
            "personnel_assigned": [
              {
                "personnel": {
                  "_id": "64ab66a2035b6ed93140a9d0",
                  "sid": "102",
                  "user": "64ab66a2035b6ed93140a9cc",
                  "official_name": "Madhavan Mukund",
                  "designation": "officer",
                  "photograph": "https://link.png",
                  "dob": "2000-07-16T00:00:00.000Z",
                  "blood_group": "B-",
                  "identification_mark": "None",
                  "posted_at": "Delhi",
                  "address": "Delhi",
                  "__v": 0
                },
                "_id": "64ae0a957175eb1e6e06766b",
                "gps_data": [],
                "rfid_data": []
              },
              {
                "personnel": {
                  "_id": "64ab66a2035b6ed93140a9d1",
                  "sid": "103",
                  "user": "64ab66a2035b6ed93140a9cd",
                  "official_name": "Harish Guruprasad Ramaswamy",
                  "designation": "officer",
                  "photograph": "https://link.png",
                  "dob": "2000-07-16T00:00:00.000Z",
                  "blood_group": "B-",
                  "identification_mark": "None",
                  "posted_at": "Delhi",
                  "address": "Delhi",
                  "__v": 0
                },
                "_id": "64ae0a957175eb1e6e06766c",
                "gps_data": [],
                "rfid_data": []
              }
            ],
            "__v": 1
          }
        ],
        "__v": 1
      }
    },
    "All users": {
      "success": true,
      "status": 200,
      "message": "All users",
      "data": [
        {
          "_id": "64b57fd6ce6f2178b5a5c95d",
          "username": "Shahbaz",
          "name": "Shahbaz",
          "role": "SP",
          "last_login": "2023-08-09T00:05:02.673Z",
          "__v": 0,
          "police_station": "lal kua"
        },
      ]
    },
    "Create shift req.body": {
      "shift_name": "Ghaziabad Mela Duty Shift 1",
      "start_time": "2025-07-20T07:25:07.000Z",
      "end_time": "2025-07-21T07:25:07.000Z",
      "duty": "64adc1982a9b6864cc61b521",
      "distance_radius": 250,
    },
    "Shift created successfully response": {
      "success": true,
      "status": 200,
      "message": "Shift created successfully",
      "data": {
        "shift_name": "Ghaziabad Mela Duty Shift 3",
        "duty": "64adc1982a9b6864cc61b521",
        "start_time": "2025-07-20T07:25:07.000Z",
        "end_time": "2025-07-21T07:25:07.000Z",
        "hardwares_attached": [],
        "_id": "64ade0eabd76d9ec1d2dd9c9",
        "personnel_assigned": [],
        "__v": 0
      }
    },
    "Get ongoing shifts res.body": {
      "success": true,
      "status": 200,
      "message": "Ongoing shifts fetched successfully",
      "data": [
        {
          "_id": "64c91ce556698aa048844324",
          "shift_name": "Year Long Duty : Shift 1",
          "duty": {
            "_id": "64c90e5753ab1fddbaf7f7e7",
            "title": "Year Long Duty",
            "description": "Duty ends in 2025",
            "venue": "India Gate",
            "location": "28.6129166,77.2246388",
            "start_time": "2023-08-01T03:30:00.000Z",
            "end_time": "2025-08-01T03:30:00.000Z",
            "note": "For testing",
            "__v": 1
          },
          "start_time": "2023-08-01T03:30:00.000Z",
          "end_time": "2025-08-01T03:30:00.000Z"
        }
      ]
    },
    "Shift fetched successfully response": {
      "success": true,
      "status": 200,
      "message": "Shift fetched successfully",
      "data": {
        "_id": "64ae09d47175eb1e6e067665",
        "shift_name": "Morning Shift",
        "duty": "64ae09937175eb1e6e067663",
        "start_time": "2025-07-20T07:25:07.000Z",
        "end_time": "2025-07-21T07:25:07.000Z",
        "hardwares_attached": [],
        "personnel_assigned": [
          {
            "personnel": {
              "_id": "64ab66a2035b6ed93140a9d0",
              "sid": "102",
              "user": "64ab66a2035b6ed93140a9cc",
              "official_name": "Madhavan Mukund",
              "designation": "officer",
              "photograph": "https://link.png",
              "dob": "2000-07-16T00:00:00.000Z",
              "blood_group": "B-",
              "identification_mark": "None",
              "posted_at": "Delhi",
              "address": "Delhi",
              "__v": 0
            },
            "_id": "64ae0a957175eb1e6e06766b",
            "gps_data": [],
            "rfid_data": []
          },
          {
            "personnel": {
              "_id": "64ab66a2035b6ed93140a9d1",
              "sid": "103",
              "user": "64ab66a2035b6ed93140a9cd",
              "official_name": "Harish Guruprasad Ramaswamy",
              "designation": "officer",
              "photograph": "https://link.png",
              "dob": "2000-07-16T00:00:00.000Z",
              "blood_group": "B-",
              "identification_mark": "None",
              "posted_at": "Delhi",
              "address": "Delhi",
              "__v": 0
            },
            "_id": "64ae0a957175eb1e6e06766c",
            "gps_data": [],
            "rfid_data": []
          },
          {
            "personnel": {
              "_id": "64aafded69d38a1c547c36ac",
              "sid": "123456789",
              "user": "64aafded69d38a1c547c36aa",
              "official_name": "Shahbaz",
              "designation": "Officer",
              "photograph": "https://www.google.com",
              "dob": "2000-07-16T07:25:07.000Z",
              "blood_group": "B-",
              "identification_mark": "None",
              "posted_at": "Delhi",
              "address": "Delhi",
              "__v": 0
            },
            "_id": "64ae1052c1d6d3af043b8299",
            "gps_data": [],
            "rfid_data": []
          }
        ],
        "__v": 2
      }
    },
    "Add personnel to shift req.body": {
      "personnel_array": ["64aafded69d38a1c547c36ac", "64ab66a2035b6ed93140a9d0", "64aafded69d38a1c547c36ad"]
    },
    "Add hardwares to shift req.body": {
      "hardware_array": ["64c6acd7b50ee9144129c6d8", "64c6cc5551619abc4c55557f", "64c7ec70b50ee9144129caa0"]
    },
    "Personnel added to the shift response": {
      "success": true,
      "status": 200,
      "message": "Personnel added to shift successfully",
      "data": {
        "sid_added": [
          "401"
        ],
        "sid_not_added": [],
        "sid_not_added_because_clashing_shifts": [
          {
            "sid": "401",
            "clashing_shift_name": "shift 1",
            "clashing_shift_duty": "64d24eac8c423c29c9a2715e"
          }
        ]
      }
    },
    "hardware added to the shift response": {
      "success": true,
      "status": 200,
      "message": "Hardware added to shift successfully",
      "data": {
        "hardware_added": [
          "64c6acd7b50ee9144129c6d8",
          "64c6cc5551619abc4c55557f",
          "64c7ec70b50ee9144129caa0"
        ],
        "hardware_not_added": []
      }
    },
    "Personnel removed from the shift response": {
      "success": true,
      "status": 200,
      "message": "Personnel removed from shift successfully",
      "data": {
        "personnel_removed": [
          "64aafded69d38a1c547c36ac",
          "64ab66a2035b6ed93140a9d0"
        ],
        "personnel_not_removed": [
          "64aafded69d38a1c547c36ad"
        ]
      }
    },
    "Hardware removed from the shift response": {
      "success": true,
      "status": 200,
      "message": "Hardwares removed from shift successfully",
      "data": {
        "hardwares_removed": [
          "64c7ec70b50ee9144129caa0",
          "64c6cc5551619abc4c55557f",
          "64c6acd7b50ee9144129c6d8"
        ],
        "hardwares_not_removed": []
      }
    },
    "Report generated successfully": {
      "success": true,
      "status": 200,
      "message": "Report generated successfully",
      "data": {}
    },
    "App get duty res.body": {
      "success": true,
      "status": 200,
      "message": "Shifts fetched successfully",
      "data": {
        "shifts": [
          {
            "_id": "64b59093c47b6793eb6ed233",
            "shift_name": "Ghaziabad Mela Duty Day 1 Shift 1",
            "duty": {
              "_id": "64b59062c47b6793eb6ed22d",
              "title": "Ghaziabad Mela Duty",
              "description": "Ghaziabad Mela Duty",
              "venue": "Ghaziabad",
              "location": "28.6543728,77.409437",
              "note": "None"
            },
            "start_time": "2023-07-18T01:30:00.000Z",
            "end_time": "2023-07-18T06:30:00.000Z",
            "__v": 1
          }
        ],
        "totalPages": 1,
        "currentPage": "1"
      }
    },
    "App get duty res.body": {
      "success": true,
      "status": 200,
      "message": "Shift fetched successfully",
      "data": {
        "_id": "64b59093c47b6793eb6ed233",
        "shift_name": "Ghaziabad Mela Duty Day 1 Shift 1",
        "duty": {
          "_id": "64b59062c47b6793eb6ed22d",
          "title": "Ghaziabad Mela Duty",
          "description": "Ghaziabad Mela Duty",
          "venue": "Ghaziabad",
          "location": "28.6543728,77.409437",
          "note": "None"
        },
        "start_time": "2023-07-18T01:30:00.000Z",
        "end_time": "2023-07-18T06:30:00.000Z",
        "__v": 1
      }
    },
    "App start_stop duty req.body": {
      "time": "2023-07-18T01:30:00.000Z"
    },
    "Duty started successfully": {
      "success": true,
      "status": 200,
      "message": "Duty started successfully",
      "data": {}
    },
    "Duty stopped successfully": {
      "success": true,
      "status": 200,
      "message": "Duty stopped successfully",
      "data": {}
    },
    "App push gps data req.body": {
      latitude: "28.6129166",
      longitude: "77.2246388",
      timestamp: "2023-07-18T04:18:00.000+05:30"
    },
    "App bulk push gps data req.body": {
      "gps_data": [
        {
          "latitude": "28.6129166",
          "longitude": "77.2246388",
          "timestamp": "2023-07-18T04:18:00.000+05:30"
        }
      ]
    },
    "App post issue req.body": {
      "issue_category": "Electricity",
      "description": "No electricity in the area"
    },
    "Issue posted successfully": {},
    "Gps data pushed successfully": {
      "success": true,
      "status": 200,
      "message": "Gps data pushed successfully",
      "data": {}
    },
    "Duty_state_conflict": {
      "success": false,
      "status": 400,
      "message": "Duty already started or stopped",
      "data": {}
    },
    "Hardware data push req.body": {
      "hardware_id": "123",
      "secret": "123456789",
      "timestamp": "2023-07-18T04:18:00.000+05:30",
      "data": "64b580ecce6f2178b5a5c963"
    },
    "Hardware data successfully pushed": {
      "success": true,
      "status": 200,
      "message": "Data pushed successfully",
      "data": {}
    },
    "Hardware not attached to any shift": {
      "success": false,
      "status": 400,
      "message": "Hardware not attached to any shift",
      "stack": "Error: Hardware not attached to any shift\n    at pushDataController (file:///C:/Users/Shahbaz/Desktop/Kawach/TrackPatrol-Server/controllers/hardwareController.js:39:25)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
    },
    "Hardware not found": {
      "success": false,
      "status": 404,
      "message": "Hardware not found",
      "stack": "Error: Hardware not found\n    at pushDataController (file:///C:/Users/Shahbaz/Desktop/Kawach/TrackPatrol-Server/controllers/hardwareController.js:39:25)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
    },
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