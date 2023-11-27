import { Box, Container } from '@mui/system';
import { useState, React } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Avatar, Typography, Stack } from '@mui/material';
import Iconify from '../components/iconify';
import useResponsive from '../hooks/useResponsive';
import AgregarLibroForm from '../components/agregarLibroForm/AgregarLibroForm';

const StyledRoot2 = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
}));

export default function () {
  const [goBack, setGoBack] = useState(false);
  if (goBack) {
    return <Navigate to="/dashboard/inicio" />;
  }

  return (
    <>
      <Helmet>
        <title> Añadir Libro | RentARead </title>
      </Helmet>

      <Container maxWidth="sm" class="container-sm" sx={{ marginBottom: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" gutterBottom>
              Agregar Libro
            </Typography>
            <Avatar
              variant="rounded"
              alt="Login"
              src={'/static/libro1.png'}
              style={{ width: '10vh', height: '10vh', marginLeft: '10px' }}
            />
          </Stack>
          <Stack direction="row" gap={1}>
            <Button
              onClick={() => {
                setGoBack(true);
              }}
              variant="contained"
              startIcon={<Iconify icon="ri:arrow-go-back-fill" />}
              style={{ marginRight: '20px' }}
            >
              Volver
            </Button>
          </Stack>
        </Stack>
        <div className="layout">
          <AgregarLibroForm />
        </div>
      </Container>
    </>
  );
}
