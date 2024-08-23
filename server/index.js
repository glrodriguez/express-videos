import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import Message from '../schemas/messageModel.js';
import cors from 'cors';
import config from '../src/config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';

// Database
import { getConnection } from "../database/database.js";

// Routers
import userRouter from "../routes/userRouter.js";
import movieRouter from '../routes/movieRouter.js';


dotenv.config();

const port = config.port || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

export const connection = await getConnection();

io.on('connection', async (socket) => {     // Crea una conexion por cada cliente que accede al server
  console.log('Usuario conectado');

  try {
    const results = await Message.find();

    results.forEach(result => {
      socket.emit('chat message', result.content, result.user)
    })
  } catch (e) {
    console.error(e)
  }

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');    // Cuando se cierra el cliente, se cierra la conexion
  });

  socket.on('chat message', async (msg) => {
    //io.emit('chat message', msg);   // cuando uso io, hago un broadcast a todos los sockets abiertos
                                      // cuando uso socket.emit, envio el mensaje a el socket especifico
    const username = socket.handshake.auth.username ?? 'anonymous';

    try {
      const message = new Message({
        content: msg,
        user: username
      });
      await message.save();
    } catch (e) {
      console.error(e);
      return;
    }

    io.emit('chat message', msg, username)
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

app.use(express.static(path.join(__dirname, 'client')));

app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use('/movies', movieRouter);
app.use('/users', userRouter);

server.listen(port, () => {
  console.log('Server running on port ' + port);
});
