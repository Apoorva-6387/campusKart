const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', (req, res) => {
  res.send('Message route working ✅');
});

router.get('/last/:email', async (req, res) => {
  const email = req.params.email;

  const rooms = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: email },
          { room: { $regex: email } }
        ]
      }
    },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$room',
        lastMessage: { $first: '$$ROOT' }
      }
    },
    { $sort: { 'lastMessage.timestamp': -1 } }
  ]);

  res.json(rooms);
});

module.exports = router;
