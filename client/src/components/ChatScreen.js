import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  TextField,
} from '@mui/material';
import MessageCard from './MessageCard';

const ChatScreen = () => {
  const { id, name } = useParams();
  const [messages, setMessages] = useState([]);

  const getAllMessages = () => {
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2MjA3OTA1MH0.BYlgfZMf36BJvtXkeKQ6_9AEDE1Nog4bFmcr_Ps21ok',
      },
      body: JSON.stringify({
        query: `
        query MessagesByUser($messagesByUserReceiverId2: Int!) {
          messagesByUser(receiverId: $messagesByUserReceiverId2) {
            text
            id
            receiverId
            senderId
            createdAt
          }
        }
        `,
        variables: { messagesByUserReceiverId2: 3 },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data.messagesByUser);
        // update state
      });
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  return (
    <Box flexGrow='1'>
      <AppBar position='static' sx={{ backgroundColor: 'white', boxShadow: 0 }}>
        <Toolbar>
          <Avatar
            src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
            sx={{ width: '32px', height: '32px', mr: 2 }}
          />
          <Typography varisant='h6' color='black'>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        backgroundColor='#f5f5f5'
        height='80vh'
        padding='10px'
        sx={{ overflowY: 'auto' }}
      >
        <MessageCard text='hi mukesh' date='1223' direction={'start'} />
        <MessageCard text='hi mukesh' date='1223' direction={'end'} />
      </Box>
      <TextField
        placeholder='Enter a message'
        variant='standard'
        fullWidth
        multiline
        rows={2}
      />
    </Box>
  );
};

export default ChatScreen;
