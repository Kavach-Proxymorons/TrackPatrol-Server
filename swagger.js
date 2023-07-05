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
  host: 'localhost:3000',
  schemes: ['http'],
};

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import('./app.js'); 
  });