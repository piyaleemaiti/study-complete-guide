// In this file you can configure migrate-mongo
const localMONGODB_URL = 'mongodb://mongo:27017';
const prodMongoDBURL = 'mongodb+srv://m001-student:m001-mongodb-basics@cluster0-kjwk5.mongodb.net';

const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: localMONGODB_URL,

    // TODO Change this to your database name:
    databaseName: "postmessages",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir 
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false
};

// Return the config as a promise
module.exports = config;
