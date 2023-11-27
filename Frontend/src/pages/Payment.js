import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container } from '@mui/system';
import swal from 'sweetalert';
import Iconify from '../components/iconify';
import Customer from './MisVentas';
import Bills from './MisCompras';

export default function PaymentPage(props) {
  const confirmacion = () => {
    swal({
      text: 'Se ha añadido el pago a tu factura',
      icon: 'success',
      button: 'Aceptar',
    });
  };

  const error = () => {
    swal({
      text: 'No se ha podido añadir el pago a tu factura',
      icon: 'Error',
      button: 'Aceptar',
    });
  };

  const [goBack, setGoBack] = useState(false);

  const [goToCustomer, setGoToCustomer] = useState(false);

  const [amount, setAmount] = useState(0);

  const [data, setData] = useState({
    id_factura: '',
    cantidad: '',
  });

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }

  const url = 'http://127.0.0.1:8000/api/pagarpresencial';

  function submit(e) {
    e.preventDefault();
    try {
      fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (String(data.success) === 'Pago presencial') {
            confirmacion();
          } else {
            console.log('falloooooo');
            error();
          }
        });
    } catch (error) {
      console.warn(error);
    }
  }

  if (goBack) {
    return <Bills customer={false} name={props.name} />;
  }

  if (goToCustomer) {
    return <Customer />;
  }

  return (
    <>
      <Helmet>
        <title> Pagos presenciales </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Pagos presenciales
          </Typography>
          <Stack direction="row" gap={1}>
            <Button
              onClick={() => {
                setGoBack(true);
              }}
              variant="contained"
              startIcon={<Iconify icon="ri:arrow-go-back-fill" />}
            >
              Volver
            </Button>
            <Button
              onClick={() => {
                setGoToCustomer(true);
              }}
              variant="contained"
            >
              Lista de clientes
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: '5rem' }}>
          <div>
            <div>
              <TextField
                disabled
                onChange={(e) => handle(e)}
                id="id_factura"
                label="ID de factura"
                defaultValue={props.idBill}
                sx={{ m: 1, width: '25ch' }}
              />
              <TextField
                disabled
                id="userName"
                label="Nombre del cliente"
                defaultValue={props.name}
                sx={{ m: 1, width: '25ch' }}
              />
            </div>
            <Box sx={{ display: 'flex' }}>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="Cantidad-a-pagar">Cantidad</InputLabel>
                <OutlinedInput
                  onChange={(e) => handle(e)}
                  id="cantidad"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Cantidad"
                />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Button onClick={(e) => submit(e)} variant="contained" fullWidth sx={{ m: 1 }}>
                Pagar
              </Button>
            </Box>
          </div>
        </Box>
      </Container>
    </>
  );
}
