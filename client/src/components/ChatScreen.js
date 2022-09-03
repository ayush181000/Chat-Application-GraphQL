import React from 'react';
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
import { GET_MSG } from '../graphql/query';
import { useQuery } from '@apollo/client';

const ChatScreen = () => {
  const { id, name } = useParams();

  const { data, loading, error } = useQuery(GET_MSG, {
    variables: { receiverId: +id },
  });

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
        {loading ? (
          <Typography variant='h6'>Loading chats</Typography>
        ) : (
          data.messagesByUser.map((msg) => {
            return (
              <MessageCard
                key={msg.id}
                text={msg.text}
                date={msg.createdAt}
                direction={msg.receiverId == +id ? 'end' : 'start'}
              />
            );
          })
        )}
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
