import React from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { darken } from 'polished';
import Logo from '../logo/Logo';

// Este componente representa la barra de navegación que
// se muestra en la parte superior de la página y contiene un
// logo y un botón de login.
export default function NavBar() {
  const navigate = useNavigate();

  // Direcionamiento
  const handleClick = () => {
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        m: { xs: '1.5rem', md: '1rem' },
        mx: { xs: '3rem', md: '5rem' },
      }}
    >
      <Logo />
      <LoadingButton id="login" variant="contained" onClick={handleClick} height="100rem">
        Login
      </LoadingButton>
    </Box>
  );
}
