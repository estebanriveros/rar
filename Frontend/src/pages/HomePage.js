import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
// @mui

import { styled } from '@mui/material/styles';
import { Container, Typography, Avatar, Box, List, ListItemText } from '@mui/material';
// components
import NavBar from '../components/nav-section/NavBar';
// hooks
import useResponsive from '../hooks/useResponsive';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '100%',
  },
}));

const StyledRoot2 = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '45%',
    flexDirection: 'column',
    alignItems: 'justify',
    justifyContent: 'content-distribution',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '40vh',
  display: 'flex',
  justifyContent: 'normal',
  flexDirection: 'column',
  padding: theme.spacing(10, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    // Eliminar todas las cookies al entrar en la página
    const cookies = [
      'ciudad',
      'direccion',
      'cedula',
      'email',
      'telefono',
      'tipoDocumento',
      'nombre',
      'latitud',
      'longitud',
      'listaCoordenadas',
      'listalibros',
      'avatar',
      'calificacion',
    ];

    cookies.forEach((cookie) => {
      Cookies.remove(cookie);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title> RentARead - Home</title>
      </Helmet>
      <NavBar />
      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent sx={{ textAlign: 'justify', alignItems: 'center' }}>
            <Typography variant="h2" paragraph sx={{ mb: '1rem' }}>
              RentARead
              <Typography sx={{ color: 'text.secondary', marginTop: '2rem' }}>
                <p>
                  Nos complace darle la bienvenida a RentARead, nuestra página web de renta, venta e intercambio de
                  libros en línea, nos apasiona la lectura y creemos que todos deberían tener acceso a una amplia
                  variedad de libros. Nuestro servicio de alquiler de libros en línea ofrece una experiencia de lectura
                  única y cómoda que le permitirá acceder a una amplia selección de libros desde la comodidad de su
                  hogar.
                </p>{' '}
                <p>
                  Le invitamos a explorar nuestra colección de libros y a experimentar todo lo que RentARead tiene que
                  ofrecer. Esperamos ser su destino número uno para la lectura en línea y ayudarle a descubrir nuevos
                  títulos y autores que le apasionarán. ¡Gracias por elegir RentARead!
                </p>
              </Typography>
            </Typography>
            <Box sx={{ width: '150%', maxWidth: '100%' }}>
              <List>
                <ListItemText primary="https://github.com/bluruwu/RentARead" />
              </List>
            </Box>
          </StyledContent>
        </Container>

        <StyledRoot2>
          {mdUp && (
            <Avatar
              variant="rounded"
              alt="Login"
              src={'/static/HomePage2.jpg'}
              style={{
                width: 'auto',
                height: '90%',
              }}
            />
          )}
        </StyledRoot2>
      </StyledRoot>
    </>
  );
}
