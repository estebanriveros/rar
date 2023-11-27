import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';

import swal from 'sweetalert';
import Cookies from 'js-cookie';
import { Stack, Typography, MenuItem, Box, TextField, Button, Container, Avatar } from '@mui/material';
import Iconify from '../components/iconify';
import Customer from './MisVentas';
import Bills from './MisCompras';

export default function PaymentPage(props) {
  const { libro, name, urlImagen } = useParams();
  console.log('libro ', libro);

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

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }
  const [listalibros, setListalibros] = useState([]);

  const url = 'http://127.0.0.1:8000/api/librosdisponibles';
  const [data, setData] = useState({});

  useEffect(() => {
    function fetchCatalogo() {
      swal({
        title: 'Cargando',
        text: 'Un momento...',
        icon: 'info',
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      });

      fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if ('success' in data) {
            Cookies.set('listalibros', data.success); // Guardar los datos en la cookie listalibros
            setListalibros(data.success);
            swal.close();
          } else if ('error' in data) {
            console.log(data.error);
            swal.close();
          } else {
            swal.close();
          }
        })
        .catch((error) => {
          console.log(error);
          swal.close();
        });
    }

    if (Cookies.get('nombre')) {
      // La cookie existe
      fetchCatalogo();
      console.log('La cookie existe');
    } else {
      // La cookie no existe

      console.log('La cookie no existe');
    }
  }, []);
  console.log(listalibros);

  const [selectedOption, setSelectedOption] = useState('');
  const [secondAvatarImage, setSecondAvatarImage] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const options = listalibros.map((libro) => libro.titulo);

  if (goBack) {
    return <Bills customer={false} name={props.name} />;
  }

  if (goToCustomer) {
    return <Customer />;
  }

  const handleChange2 = (event) => {
    const selectedBook = listalibros.find((libro) => libro.titulo === event.target.value);
    setSelectedOption(event.target.value);
    if (selectedBook) {
      const imagePath = selectedBook.imagen;
      const imageName = imagePath.substring(imagePath.indexOf('/static'));
      console.log(imageName);
      const selectedId = selectedBook.idLibro; // Obtener el idLibro del libro seleccionado
      setSelectedBookId(selectedId);
      console.log(selectedId); // Mostrar el idLibro en la consola
      setSecondAvatarImage(imageName);
    } else {
      // En caso de que selectedBook sea undefined
      setSelectedBookId(''); // Reiniciar el idLibro seleccionado
      setSecondAvatarImage(''); // Reiniciar la imagen del segundo avatar
    }
  };

  const intercambioLibro = () => {
    console.log(libro, selectedBookId);
    const data2 = {
      id_libro_vendedor: libro,
      id_libro_cliente: selectedBookId,
    };

    const url = 'http://127.0.0.1:8000/api/intercambiarlibro';
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data2), // Enviar los dos parámetros en el cuerpo de la solicitud
    })
      .then((response) => response.json())
      .then((data2) => {
        // Mostrar ventana emergente de éxito
        swal({
          title: 'Éxito',
          text: data2.success, // Mostrar el mensaje recibido en la respuesta
          icon: 'success',
          buttons: {
            confirm: {
              text: 'Aceptar',
              className: 'swal-button--success',
            },
          },
        }).then(() => {
          // Redirigir a otra página
          window.location.href = '/dashboard/inicio'; // ir a inicio
        });
      })
      .catch((error) => {
        console.error('Error al intercambiar el libro:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title> Intercambio</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Intercambio
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'lef', mt: '5rem' }}>
          <div>
            <div>
              <div style={{ display: 'flex' }}>
                <Avatar
                  alt={name}
                  src={urlImagen}
                  variant="rounded"
                  style={{ width: '20vh', height: '30vh', marginRight: '7rem', marginLeft: '2rem' }}
                />
                <Avatar
                  alt="titulo"
                  src={secondAvatarImage}
                  variant="rounded"
                  style={{ width: '20vh', height: '30vh' }}
                />
              </div>
            </div>

            <div>
              <TextField
                disabled
                onChange={(e) => handle(e)}
                id="Libro "
                label={name}
                defaultValue={props.idBill}
                sx={{ m: 1, width: '25ch' }}
              />

              <TextField
                id="userName"
                label="Intercambiar por"
                defaultValue={props.name}
                sx={{ m: 1, width: '25ch' }}
                select
                value={selectedOption}
                onChange={handleChange2}
              >
                <MenuItem value="">Seleccione un libro</MenuItem>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <Box sx={{ display: 'flex' }} onClick={intercambioLibro}>
              <Button sx={{ padding: '10px 20px' }}>Solicitar Intercambio</Button>
            </Box>
          </div>
        </Box>
      </Container>
    </>
  );
}
