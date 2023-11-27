import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import swal from 'sweetalert';
import { darken } from 'polished';
import NavBar2 from '../../../components/nav-section/NavBar2';
import Iconify from '../../../components/iconify';
import CSRFToken from '../../../components/csrftoken';

import account from '../../../_mock/account';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const info = (msg) => {
    swal({
      text: msg,
      icon: 'info',
      button: 'Aceptar',
    });
  };

  // Captcha
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [captchaResult, setCaptchaResult] = useState();
  const handleRecaptcha = (value) => {
    fetch('http://127.0.0.1:8000/api/recaptcha', {
      method: 'POST',
      body: JSON.stringify({ captcha_value: value }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (String(data.captcha.success) === 'true') {
          setDisableSubmit(false);
        } else setDisableSubmit(true);
        console.log(data.captcha.success);
        setCaptchaResult(data.captcha.success);
      });
  };

  // Login
  const url1 = 'http://127.0.0.1:8000/api/login';

  const [showPassword, setShowPassword] = useState(false);
  const [goToDashboard, setGoToDashboard] = useState(false);
  const [goToRegister, setGoToRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({
    email: '',
    contrasena: '',
  });

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }

  // Activar solo en pruebas e2e boton de submit
  useEffect(() => {
    if (window.Cypress) {
      setDisableSubmit(false);
    }

    if (Cookies.get('nombre')) {
      // La cookie existe
      setGoToDashboard(true);
      console.log('La cookie existe');
    } else {
      // La cookie no existe
      console.log('La cookie no existe');
    }
  }, []);

  function submit(e) {
    e.preventDefault();
    setIsLoading(true);

    swal({
      title: 'Cargando',
      text: 'Un momento...',
      icon: 'info',
      buttons: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    });

    try {
      fetch(url1, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (String(data.success) === 'Usuario autenticado exitosamente') {
            Cookies.set('nombre', String(data.nombre));
            Cookies.set('email', String(data.email));
            Cookies.set('cedula', String(data.cedula));
            Cookies.set('telefono', String(data.telefono));
            Cookies.set('direccion', String(data.direccion));
            Cookies.set('ciudad', String(data.ciudad));
            Cookies.set('tipoDocumento', String(data.tipoDocumento));
            Cookies.set('latitud', String(data.latitud));
            Cookies.set('longitud', String(data.longitud));
            Cookies.set('listaCoordenadas', data.listaCoordenadas);
            Cookies.set('avatar', data.avatar);
            Cookies.set('calificacion', String(data.calificacion));
            setGoToDashboard(true);
            setIsLoading(false);
          } else if ('error' in data) {
            setIsLoading(false);
            info(String(data.error));
          }
        });
    } catch (error) {
      console.warn(error);
    }
    console.log(data);
    swal.close();
  }

  if (goToDashboard) {
    return <Navigate to="/dashboard/inicio" />;
  }

  if (goToRegister) {
    return <Navigate to="/register" />;
  }

  return (
    <>
      <CSRFToken />
      <Stack spacing={3}>
        <TextField
          onChange={(e) => handle(e)}
          value={data.email}
          name="email"
          label="Email"
          id="email"
          variant="outlined"
        />

        <TextField
          onChange={(e) => handle(e)}
          value={data.contrasena}
          name="password"
          label="Contraseña"
          id="contrasena"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="center" id="captcha" className="g-recaptcha" sx={{ pb: '1rem', marginTop: '1rem' }}>
        <ReCAPTCHA sitekey="6Lf5qt8jAAAAAAARz5DGg9H46anFT4cAd03eZ3Ig" onChange={handleRecaptcha} />
      </Stack>
      <LoadingButton
        onClick={(e) => submit(e)}
        disabled={disableSubmit}
        fullWidth
        size="large"
        type="submit"
        id="iniciarsesion"
        variant="contained"
        sx={{
          mb: '1rem',
        }}
      >
        Iniciar Sesión
      </LoadingButton>
      <NavBar2 sx={{ mb: '2rem' }} />
    </>
  );
}
