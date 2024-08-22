import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import Message from '../schemas/messageModel.js';

// Database
import { getConnection } from "../database/database.js";


dotenv.config();

const port = process.env.PORT || 3000;

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

    console.log(results);

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
    console.log(username);

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

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(port, () => {
  console.log('Server running on port ' + port);
});
