import { Button, MenuItem, TextField, Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import swal from 'sweetalert';
import CSRFToken from '../csrftoken';
import account from '../../_mock/account';

export default function AgregarLibroForm() {
  const confirmacion = () => {
    swal({
      text: 'La informacion del libro se ha registrado exitosamente',
      icon: 'success',
      button: 'Aceptar',
    });
  };

  const info = (msg) => {
    swal({
      text: msg,
      icon: 'info',
      button: 'Aceptar',
    });
  };

  // Imagen
  function enviarImagen(e) {
    const imagen = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
      const imagenData = reader.result;
      setDataLibro((dataLibro) => ({
        ...dataLibro,
        file: imagenData,
      }));
    };
    reader.readAsDataURL(imagen);
  }

  const [goToCatalogo, setGoToCatalogo] = useState(false);

  const [dataLibro, setDataLibro] = useState({
    nombre_libro: '',
    numero_paginas: '',
    codigo_ISBN: '',
    nombre_autor: '',
    genero_libro: '',
    estado_libro: '',
    uso_libro: '',
    uso_libro_opcion: '',
    editorial_libro: '',
    fecha_libro: '',
    descripcion_libro: '',
    email: account.email,
  });

  const estadoLibro = [
    { value: '1', label: 'Excelente' },
    { value: '2', label: 'Bueno' },
    { value: '3', label: 'Regular' },
    { value: '4', label: 'Deficiente' },
  ];

  const genero = [
    { value: '1', label: 'Terror' },
    { value: '2', label: 'Ciencia ficción' },
    { value: '3', label: 'Romance' },
    { value: '4', label: 'Drama' },
    { value: '5', label: 'Misterio' },
    { value: '6', label: 'Novela' },
    { value: '7', label: 'Clásico' },
    { value: '8', label: 'Suspenso' },
    { value: '9', label: 'Psicología' },
  ];

  const usoLibro = [
    { value: 'Precio de venta', label: 'Venta' },
    { value: 'Precio de renta por semana', label: 'Renta' },
    { value: 'Intercambio?', label: 'Intercambio' },
  ];

  function handle(e, select = 1) {
    const newdata = { ...dataLibro };
    if (select === 2) {
      newdata.uso_libro = e.target.value;
    } else if (select === 3) {
      newdata.genero_libro = e.target.value;
    } else if (select === 4) {
      newdata.estado_libro = e.target.value;
    } else {
      newdata[e.target.id] = e.target.value;
    }
    setDataLibro(newdata);
    console.log(newdata);
  }

  const url = 'http://127.0.0.1:8000/api/registrarLibro';

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
        body: JSON.stringify(dataLibro),
      })
        .then((response) => response.json())
        .then((dataLibro) => {
          if ('success' in dataLibro) {
            confirmacion();
            setGoToCatalogo(true);
          } else if ('error' in dataLibro) {
            info(String(dataLibro.error));
          }
        });
    } catch (error) {
      console.warn(error);
    }
  }

  if (goToCatalogo) {
    return <Navigate to="/dashboard/inicio" />;
  }

  return (
    <>
      <Helmet>
        <title> Añadir Libro </title>
      </Helmet>

      <Container>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: '1rem' }}>
          <CSRFToken />
          <div>
            <div>
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.nombre_libro}
                size="medium"
                label="Nombre del libro"
                id="nombre_libro"
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                InputProps={{ style: { width: '100%' } }}
              />
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.nombre_autor}
                size="medium"
                label="Autor"
                id="nombre_autor"
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                InputProps={{ style: { width: '100%' } }}
              />
            </div>
            <div>
              <TextField
                id="genero_libro"
                select
                label="Género"
                size="medium"
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                onChange={(e) => handle(e, 3)}
                value={dataLibro.genero_libro}
                InputProps={{ style: { width: '100%' } }}
              >
                {genero.map((optione) => (
                  <MenuItem key={optione.value} value={optione.label}>
                    {optione.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.numero_paginas}
                size="medium"
                label="Numero de páginas (Opcional)"
                id="numero_paginas"
                inputMode="numeric"
                sx={{ m: 1, width: '35ch' }}
                InputProps={{ style: { width: '100%' } }}
                InputLabelProps={{
                  style: { fontSize: 12 },
                }}
              />
            </div>
            <div>
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.codigo_ISBN}
                size="medium"
                label="ISBN (Opcional)"
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                id="codigo_ISBN"
                sx={{ m: 1, width: '35ch' }}
                InputProps={{ style: { width: '100%' } }}
              />
              <TextField
                id="estado_libro"
                select
                label="Estado"
                size="medium"
                onChange={(e) => handle(e, 4)}
                value={dataLibro.estado_libro}
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                InputProps={{ style: { width: '100%' } }}
              >
                {estadoLibro.map((optione) => (
                  <MenuItem key={optione.value} value={optione.label}>
                    {optione.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.editorial_libro}
                size="medium"
                label="Editorial"
                id="editorial_libro"
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                InputProps={{ style: { width: '100%' } }}
              />
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.descripcion_libro}
                size="medium"
                label="Descripción"
                id="descripcion_libro"
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                InputProps={{ style: { width: '100%' } }}
              />
            </div>
            <div>
              <TextField
                onChange={(e) => handle(e)}
                value={dataLibro.fecha_libro}
                size="medium"
                label="Año de publicación"
                id="fecha_libro"
                sx={{ m: 1, width: '35ch' }}
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                InputProps={{ style: { width: '100%' } }}
              />
            </div>

            <div>
              <TextField
                id="uso_libro"
                select
                label="Disponible para"
                size="medium"
                InputLabelProps={{
                  style: { fontSize: 14 },
                }}
                onChange={(e) => handle(e, 2)}
                sx={{ m: 1, width: '35ch' }}
                value={dataLibro.uso_libro}
                InputProps={{ style: { width: '100%' } }}
              >
                {usoLibro.map((optione) => (
                  <MenuItem key={optione.value} value={optione.label}>
                    {optione.label}
                  </MenuItem>
                ))}
              </TextField>

              {dataLibro.uso_libro === 'Renta' && (
                <TextField
                  id="otro_campo"
                  label="Precio de Renta"
                  size="medium"
                  onChange={(e) => handle(e, 6)}
                  value={dataLibro.otro_campo}
                  InputProps={{ style: { width: '100%' } }}
                  sx={{ m: 1, width: '35ch' }}
                />
              )}
              {dataLibro.uso_libro === 'Intercambio' && (
                <TextField
                  id="otro_campo"
                  label="¿Por cuál tipo de libro lo intercambiarías?"
                  InputLabelProps={{
                    style: { fontSize: 12 }, // establecer el tamaño de fuente deseado
                  }}
                  size="medium"
                  onChange={(e) => handle(e, 5)}
                  value={dataLibro.otro_campo}
                  InputProps={{ style: { width: '100%' } }}
                  sx={{ m: 1, width: '35ch' }}
                />
              )}

              {dataLibro.uso_libro === 'Venta' && (
                <TextField
                  id="otro_campo"
                  label="Precio Venta"
                  size="medium"
                  onChange={(e) => handle(e, 5)}
                  value={dataLibro.otro_campo}
                  InputProps={{ style: { width: '100%' } }}
                  sx={{ m: 1, width: '35ch' }}
                />
              )}
            </div>

            <div>
              <Box sx={{ margin: '10px' }}>
                <input type="file" name="file" accept="image/*" onChange={enviarImagen}/>
              </Box>
            </div>
            <Box sx={{ display: 'flex' }}>
              <Button variant="contained" sx={{ m: 1 }} onClick={(e) => submit(e)} fullWidth>
                Registrar Libro
              </Button>
            </Box>
          </div>
        </Box>
      </Container>
    </>
  );
}
