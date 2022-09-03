import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UserCard from './UserCard';

const SideBar = ({ setLoggedIn }) => {
  const users = [
    {
      id: 1,
      firstName: 'Mukes',
      lastName: 'ka',
    },
    {
      id: 2,
      firstName: 'suresh',
      lastName: 'ka',
    },
    {
      id: 3,
      firstName: 'toco toco',
      lastName: 'ka',
    },
  ];

  return (
    <Box backgroundColor='#f7f7f7' height='100vh' width='250px' padding='10px'>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h6'>Chat</Typography>
        <LogoutIcon
          onClick={() => {
            localStorage.removeItem('jwt');
            setLoggedIn(false);
          }}
        />
      </Stack>
      <Divider>
        {users.map((item) => {
          return <UserCard key={item.id} item={item} />;
        })}
      </Divider>
    </Box>
  );
};

export default SideBar;
