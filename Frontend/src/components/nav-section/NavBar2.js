import React from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { darken } from 'polished';

// Este componente representa la barra de navegación que
// se muestra en la parte superior de la página y contiene un
// logo y un botón de login.
export default function NavBar2() {
  const navigate = useNavigate();

  // Direcionamiento
  const handleClick = () => {
    navigate('/register', { replace: true });
  };

  return (
    <Box sx={{ marginLeft: '0rem', fontSize: '0rem' }}>
      <LoadingButton
        variant="contained"
        onClick={handleClick}
        id="registro"
        sx={{
          height: '3rem',
          width: '100%',

          backgroundColor: darken(0.0, 'rgb(0,0,0)'),
          '&:active': {
            backgroundColor: 'rgb(0,0,0)',
          },
          '&:focus': {
            backgroundColor: darken(0.0, 'rgb(90,90,90)'),
          },
          '&:hover': {
            backgroundColor: darken(0.0, 'rgb(90,90,90)'),
          },
        }} // aquí se crea un tono más oscuro color orange
      >
        Crear una cuenta
      </LoadingButton>
    </Box>
  );
}
