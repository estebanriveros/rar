import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Stack } from '@mui/material';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import swal from 'sweetalert';
import './index.css';
import Cookies from 'js-cookie';
import CSRFToken from '../csrftoken';

export default function PaymentForms(idlibro, valor, usolibro) {
  console.log('id libro :', idlibro);
  console.log('cantidad: ', usolibro);

  const confirmacion = (msg) => {
    swal({
      text: msg,
      icon: 'info',
      button: 'Aceptar',
      className: 'text-center', // Aplica la clase 'text-center' al contenido del cuadro de diálogo
    });
  };

  const error = () => {
    swal({
      text: 'No se ha podido procesar el pago de tu libro',
      icon: 'Error',
      button: 'Aceptar',
    });
  };

  const [state, setState] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: '',
  });

  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocusChange = (e) => {
    setState({
      ...state,
      focus: e.target.name,
    });
  };
  // POST
  const [data, setData] = useState({
    id_libro: idlibro.idLibro1,
  });
  console.log('3l dato', data);
  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }

  const [goToMisCompras, setGoToMisCompras] = useState(false);
  let url;

  if (idlibro.usolibro === 'Venta') {
    url = 'http://127.0.0.1:8000/api/comprarlibro';
  } else if (idlibro.usolibro === 'Renta') {
    url = 'http://127.0.0.1:8000/api/rentarlibro';
  }

  console.log('url :', url);

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
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if ('success' in data) {
            confirmacion(String(data.success));
            setGoToMisCompras(true);
          } else {
            error();
          }
        });
    } catch (error) {
      console.warn(error);
    }
  }

  if (goToMisCompras) {
    return <Navigate to="/dashboard/miscompras" />;
  }

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <Cards number={state.number} name={state.name} expiry={state.expiry} cvc={state.cvc} focused={state.focus} />
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="number">
                  Número de la tarjeta
                  <input
                    type="text"
                    name="number"
                    id="number"
                    maxLength="16"
                    className="form-control"
                    onChange={handleInputChange}
                    onFocus={handleFocusChange}
                  />
                </label>
              </div>
              <label htmlFor="name">
                Nombre
                <input
                  type="text"
                  name="name"
                  id="name"
                  maxLength="30"
                  className="form-control"
                  onChange={handleInputChange}
                  onFocus={handleFocusChange}
                />
              </label>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="expiry">
                  Fecha de expiración
                  <input
                    type="text"
                    name="expiry"
                    id="expiry"
                    maxLength="4"
                    className="form-control"
                    onChange={handleInputChange}
                    onFocus={handleFocusChange}
                  />
                </label>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="cvc">
                  CVC
                  <input
                    type="text"
                    name="cvc"
                    id="cvc"
                    maxLength="4"
                    className="form-control"
                    onChange={handleInputChange}
                    onFocus={handleFocusChange}
                  />
                </label>
              </div>
            </div>
            <div className="form-row">
              {/* value={data.cantidad} */}
              <div className="form-group col-md-6">
                <label htmlFor="cantidad-a-pagar">
                  Cantidad a pagar
                  <input
                    defaultValue={idlibro.valor1}
                    type="text"
                    name="cantidad-a-pagar"
                    id="cantidad"
                    className="form-control"
                    readOnly
                  />
                </label>
              </div>
            </div>
          </form>
          <Stack spacing={2}>
            <Button onClick={(e) => submit(e)} variant="contained" fullWidth sx={{ m: 1 }}>
              Pagar
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
