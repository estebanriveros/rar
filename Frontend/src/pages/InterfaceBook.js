import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Avatar, Box, Rating } from '@mui/material';
import { useState, Redirect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import Cookies from 'js-cookie';

// components
import { darken } from 'polished';

// eslint-disable-next-line import/no-unresolved
import Nav from 'src/layouts/dashboard/nav';
import AccountPopover from 'src/layouts/dashboard/header/AccountPopover'; // eslint-disable-line import/no-unresolved

// components

// hooks

import useResponsive from '../hooks/useResponsive';
import NavBook from '../components/nav-section/NavBook';
import Start from './Start';
// @mui
// components

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '100%',
  },
}));

const StyledRoot2 = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',

  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// Interfaz de libro

export default function InterfaceBook() {
  const [goPagar, setGoPagar] = useState(false);
  const [goIntercambio, setGoIntercambiar] = useState(false);

  const { name, autor, vendedorNombre, descripcion, disponible, valor, idlibro, urlImagen, calificacion } = useParams();
  console.log(calificacion);

  const mdUp = useResponsive('up', 'md');
  const numero = calificacion;

  const [rating, setRating] = useState(numero); // Valor inicial de la calificación

  function handleRatingChange(newRating) {
    setRating(newRating);
  }
  function getText(parametro) {
    console.log(parametro);
    switch (parametro) {
      case 'Venta':
        return 'Comprar por $$';
      case 'Intercambio':
        return ' Se intercambia el libro: ';
      case 'Renta':
        return 'Rentar por ....';
      default:
        return 'Rentar por $$';
    }
  }

  if (goPagar) {
    return <Navigate to={`/dashboard/onlinepayment/${idlibro}/${valor}/${disponible}`} />;
  }
  if (goIntercambio) {
    const rutaCodificada = encodeURIComponent(urlImagen);
    return <Navigate to={`/dashboard/intercambios/${idlibro}/${name}/${rutaCodificada}`} />;
  }

  // Direcionamiento

  return (
    <>
      <Helmet>
        <title> Book | RentARead </title>
      </Helmet>
      {/* <Nav /> */}
      <Container maxWidth="sm" class="container-sm">
        <StyledRoot2 tack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Box
            style={{
              position: 'absolute',
              left: '25vw',
              top: '58vh',
              transform: 'translateY(-50%)',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <Avatar
                variant="rounded"
                alt="Login"
                src={urlImagen}
                style={{
                  width: '25vh',
                  height: '40vh',
                }}
              />
            </div>

            <Typography
              variant="h2"
              paragraph
              style={{
                position: 'absolute',
                fontSize: '20px',
                top: '1vh', // <-- cambiar valor absoluto por unidades de vh
                left: '15vw',
                width: '110vh',
                height: '40vh',
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                position: 'absolute',
                top: '7vh', // <-- cambiar valor absoluto por unidades de vh
                left: '15vw',
                width: '100vh',
                height: '30vh',
              }}
            >
              Autor : {autor}
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              <p
                style={{
                  position: 'absolute',
                  top: '12vh', // <-- cambiar valor absoluto por unidades de vh
                  left: '15vw',
                  width: '100vh',
                  height: '30vh',
                }}
              >
                Disponible para : {disponible}{' '}
              </p>
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              <p
                style={{
                  position: 'absolute',
                  top: '29vh', // <-- cambiar valor absoluto por unidades de vh
                  left: '15vw',
                  width: '100vh',
                  height: '30vh',
                }}
              >
                Ofrecido Por : <Link to={`/dashboard/perfilvendedor/${idlibro}`}>{vendedorNombre}</Link>
              </p>
            </Typography>

            <LoadingButton
              variant="contained"
              sx={{
                backgroundColor: darken(0.0, 'rgb(251, 131, 36)'),
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderRadius: 1,
                width: '220px',
                height: '70px',
                py: 1,
                px: 3,
                mr: 1,
                position: 'absolute',
                top: '17vh', // <-- cambiar valor absoluto por unidades de vh
                left: '15vw',
                '&:hover': {
                  backgroundColor: darken(0.05, 'rgb(251, 131, 36)'),
                },
              }}
              onClick={() => {
                if (disponible !== 'Intercambio') {
                  setGoPagar(true);
                } else {
                  console.log('AAA');
                  setGoIntercambiar(true);
                }
              }}
            >
              {getText(disponible)} {valor}
            </LoadingButton>

            <Start
              value={rating}
              onChange={() => handleRatingChange()}
              style={{
                position: 'absolute',
                top: '30vh', // <-- cambiar valor absoluto por unidades de vh
                left: '30vw',
                width: '10vh',
                height: '10vh',
              }}
            />

            <Typography
              sx={{ color: 'text.secondary' }}
              style={{
                position: 'absolute',
                top: '32vh', // <-- cambiar valor absoluto por unidades de vh
                left: '25vw',
                width: '100vh',
                height: '30vh',
              }}
            >
              {rating}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              <p>{descripcion}</p>
            </Typography>
          </Box>
        </StyledRoot2>
      </Container>
    </>
  );
}
