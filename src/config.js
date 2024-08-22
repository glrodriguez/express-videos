import { config } from "dotenv";

// Loads .env file contents into process.env by default
config();

export default {
  host: process.env.HOST,
  db_port: process.env.DB_PORT,
  port: process.env.PORT,
  database: process.env.DATABASE,
  mongo_uri: process.env.MONGO_URI,
  jwt_key: process.env.JWT_KEY
}
