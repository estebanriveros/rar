import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Avisos',
    icon: 'eva:home-fill',
  },
  {
    label: 'Configuración',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [goToInicio, setGoToInicio] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const url = 'http://127.0.0.1:8000/api/logout';

  function submit(e) {
    e.preventDefault();
    try {
      fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          withCredentials: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if ('success' in data) {
            setGoToInicio(true);
            Cookies.remove('ciudad');
            Cookies.remove('direccion');
            Cookies.remove('cedula');
            Cookies.remove('email');
            Cookies.remove('telefono');
            Cookies.remove('tipoDocumento');
            Cookies.remove('nombre');
            Cookies.remove('latitud');
            Cookies.remove('longitud');
            Cookies.remove('listaCoordenadas');
            Cookies.remove('listalibros');
            Cookies.remove('avatar');
            Cookies.remove('calificacion');
          }
        });
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    // Obtener los datos de las cookies
    const obtenerDatosUsuarioCookie = () => {
      const nombre = Cookies.get('nombre');
      const email = Cookies.get('email');
      const avatarNumber = Cookies.get('avatar');
      const avatarURL = `/static/images/avatars/avatar_${avatarNumber}.jpg`;

      return {
        nombre,
        email,
        avatar: avatarURL,
        // Agrega más propiedades para otros datos de las cookies
      };
    };

    // Actualizar el estado con los datos de las cookies
    setUserData(obtenerDatosUsuarioCookie());
  }, []);

  if (goToInicio) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={userData.avatar} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userData.nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={(handleClose, (e) => submit(e))} sx={{ m: 1 }}>
          Cerrar sesión
        </MenuItem>
      </Popover>
    </>
  );
}
