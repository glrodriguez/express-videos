import express from "express";
// import cors from 'cors';
import movieRouter from "../routes/movieRouter.js";
import { corsMiddleware } from "./cors.js";


const app = express();

app.disable('x-powered-by');
app.use(express.json());
// app.use(cors());
app.use(corsMiddleware());

app.use('/movies', movieRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
