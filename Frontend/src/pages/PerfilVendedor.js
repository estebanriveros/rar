import * as React from 'react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Stack, Avatar, Typography, Rating } from '@mui/material';
import account from '../_mock/account';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 400,
  margin: 'auto',
  float: 'left',
  position: 'relative',
  left: '300px',
  minHeight: '5vh',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(4, 2),
}));

const StyledContentimg = styled('div')(({ theme }) => ({
  maxWidth: 100,
  margin: 'auto',
  float: 'left',
  position: 'relative',
  left: '80px',
  minHeight: '10vh',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(4, 2),
}));

const StyledContentInfo = styled('div')(({ theme }) => ({
  maxWidth: 300,
  margin: 'auto',
  float: 'left',
  position: 'relative',
  top: '20px',
  left: '550px',
  minHeight: '5vh',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(2, 2),
}));

export default function Cliente() {
  const [userData, setUserData] = useState({});
  const [value, setValue] = React.useState(2);
  const { idlibro } = useParams();
  console.log(idlibro);
  const data = {
    id_libro: idlibro,
  };

  const url = 'http://127.0.0.1:8000/api/perfilvendedor';

  useEffect(() => {
    // Obtener los datos de las cookies
    function obtenerDatosUsuario() {
      fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          const nombre = data.nombre;
          const telefono = data.telefono;
          const ciudad = data.ciudad;
          const direccion = data.direccion;
          const avatar = data.avatar;
          const calificacion = data.calificacion;
          const avatarURL = `/static/images/avatars/avatar_${avatar}.jpg`;
          setUserData({ nombre, telefono, ciudad, direccion, avatar, avatarURL, calificacion });
          console.log(nombre, telefono, ciudad, direccion, avatar, calificacion);
        })
        .catch((error) => {
          console.error('Error al obtener los datos del vendedor:', error);
        });
    }
    obtenerDatosUsuario();
  }, []);

  const valor = parseInt(idlibro, 10);

  return (
    <div className="Info-cliente">
      <Helmet>
        <title>Perfil del Vendedor</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" gutterBottom>
          Perfil del Vendedor
        </Typography>
      </Stack>
      <StyledContentimg>
        <Avatar
          src={userData.avatarURL}
          style={{
            width: '200px',
            height: '200px',
          }}
        />
        <Rating
          name="star-rating"
          value={parseFloat(userData.calificacion)}
          size="large"
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          precision={0.1}
          readOnly
          max={5}
          sx={{
            position: 'absolute',
            top: '100%',
            left: '50%',
          }}
        />
        {/* <p>El valor actual es {value}</p> */}
      </StyledContentimg>

      <StyledContent sx={{ textAlign: 'left', alignItems: 'center' }}>
        <div className="contenedor-text">
          <p className="nombre"> {userData.nombre}</p>
          <p className="telefono"> Teléfono: {userData.telefono}</p>
          <p className="ciudad"> Ciudad: {userData.ciudad}</p>
          <p className="direccion"> Dirección: {userData.direccion}</p>
        </div>
      </StyledContent>
    </div>
  );
}
