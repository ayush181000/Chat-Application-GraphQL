import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  TextField,
  Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GET_MSG } from '../graphql/query';
import { SEND_MSG } from '../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import MessageCard from './MessageCard';

const ChatScreen = () => {
  const { id, name } = useParams();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const { data, loading, error } = useQuery(GET_MSG, {
    variables: { receiverId: +id },
    onCompleted(data) {
      setMessages(data.messagesByUser);
    },
  });

  const [sendMessage] = useMutation(SEND_MSG, {
    onCompleted(data) {
      setMessages((prevMessages) => [...prevMessages, data.createMessage]);
    },
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
          messages.map((msg) => {
            return (
              <MessageCard
                key={msg.id}
                text={msg.text}
                date={msg.createdAt}
                direction={msg.receiverId === +id ? 'end' : 'start'}
              />
            );
          })
        )}
      </Box>
      <Stack direction='row' justfyContent='space-between'>
        <TextField
          placeholder='Enter a message'
          variant='standard'
          fullWidth
          multiline
          rows={2}
          value={text}
          required
          onChange={(e) => setText(e.target.value)}
        />
        <SendIcon
          fontSize='large'
          onClick={() => {
            if (text !== '')
              sendMessage({
                variables: {
                  receiverId: +id,
                  text: text,
                },
              });
            setText('');
          }}
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
