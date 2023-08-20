### Trackpatrol Server

This is the server for the Trackpatrol project. It is written in javascript and uses node.js and express.js. 

### API docs 
The API docs can be found at [https://trackpatrol-server.shahbaz.tech/doc/](https://trackpatrol-server.shahbaz.tech/doc/) or [http://localhost:3000/doc/](http://localhost:3000/doc/).

### Installation
To install the server, you need to have node.js and npm installed. Then, you can run the following command in the root directory of the project:
```
npm install
```

### Running the server in test mode
To run the serveer in test mode, you can run the following command in the root directory of the project:
```
npm run dev
```

for getting error stack trace, add the following to the .env file:
```
NODE_ENV=development
```

### Running the server in production
To run the server in production mode, you can run the following command in the root directory of the project:
```
npm start
```

### Running the server in production with pm2
To run the server in production mode with pm2, you can run the following command in the root directory of the project:
```
npm run pm2
```

### Updating the api docs
To update the api docs, you can run the following command in the root directory of the project:
```
npm run update-doc
```