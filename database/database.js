import mongoose from "mongoose";
import config from "../src/config.js";


// Create the connection pool
let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
  try {
    mongoose.connect(`mongodb://${config.host}:${config.db_port}/`, { dbname: config.database });
    isConnected = true;
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error('Error connecting to MongoDB ', error);
    throw error;
  }
  }
  return mongoose.connection;
}

export const getConnection = connectToDatabase;
