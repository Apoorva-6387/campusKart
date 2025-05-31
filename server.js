// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'static')));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/helps', require('./routes/helpRoutes'));


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

const Message = require('./models/Message');

io.on('connection', socket => {
  socket.on('joinRoom', room => {
    socket.join(room);
    console.log(`🟢 Joined room: ${room}`);
  });

  socket.on('sendMessage', async ({ room, message }) => {
    const newMsg = new Message({
      room,
      sender: message.sender,
      text: message.text
    });

    await newMsg.save();

    io.to(room).emit('receiveMessage', newMsg); 
  });

  socket.on('getMessages', async (room) => {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    socket.emit('chatHistory', messages);
  });
});


http.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
