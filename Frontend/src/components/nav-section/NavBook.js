import React from "react";

import { useNavigate } from "react-router-dom";
// @mui
// import { Box, List, ListItem, ListItemButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
// components
import { darken } from 'polished';








// Este componente representa la barra de navegación que 
// se muestra en la parte superior de la página y contiene un 
// logo y un botón de login.
export default function NavBook() {
  const navigate = useNavigate();

  // Direcionamiento
  const handleClick = () => {
    navigate('/register', { replace: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <LoadingButton
        variant="contained"
        sx={{
          backgroundColor: darken(0.0, 'rgb(251, 131, 36)'),
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: 1,
          width: '220px',
          height: '20px',
          py: 1,
          px: 3,
          mr: 1,
          '&:hover': {
            backgroundColor: darken(0.05, 'rgb(251, 131, 36)'),
          },
        }}
      >
        Comprar por $$
      </LoadingButton>

      <LoadingButton
        variant="contained"
        sx={{
          backgroundColor: darken(0.0, 'rgb(251, 131, 36)'),
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: 1,
          width: '220px',
          height: '20px',
          py: 1,
          px: 3,
          mr: 1,
          '&:hover': {
            backgroundColor: darken(0.05, 'rgb(251, 131, 36)'),
          },
        }}
      >
        Rentar por $$
      </LoadingButton>

      <LoadingButton
        variant="contained"
        sx={{
          backgroundColor: darken(0.0, 'rgb(251, 131, 36)'),
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: 1,
          width: '220px',
          height: '20px',
          py: 1,
          px: 3,
          mr: 1,
          '&:hover': {
            backgroundColor: darken(0.05, 'rgb(251, 131, 36)'),
          },
        }}
      >
        Intercambiar
      </LoadingButton>

      <LoadingButton
        variant="contained"
        sx={{
          backgroundColor: darken(0.0, 'rgb(251, 131, 36)'),
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: 1,
          width: '220px',
          height: '20px',
          py: 1,
          px: 3,
          mr: 1,
          '&:hover': {
            backgroundColor: darken(0.05, 'rgb(251, 131, 36)'),
          },
        }}
      >
        Chat vendedor
      </LoadingButton>
    </div>
  );
}



