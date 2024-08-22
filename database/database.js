import mongoose from "mongoose";


// Create the connection pool
let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
  try {
    mongoose.connect(`mongodb://${process.env.HOST}:${process.env.DB_PORT}/`, { dbname: process.env.DATABASE });
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
