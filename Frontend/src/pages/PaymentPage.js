import { Helmet } from 'react-helmet-async';
import { useState, React } from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import Iconify from '../components/iconify';
import PaymentForms from '../components/PaymentForm/PaymentForms';
import Customer from './MisVentas';
import Bills from './MisCompras';

export default function PaymentPage(props) {
  const {idlibro,valor,uso} = useParams();
  console.log('pasar :',uso);

  const [goBack, setGoBack] = useState(false);

  const [goToCustomer, setGoToCustomer] = useState(false);

  if (goBack) {
    return <Bills name={props.name} />;
  }

  if (goToCustomer) {
    return <Customer />;
  }

  return (
    <>
      <Helmet>
        <title> Pagos en línea | RentARead</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Pagos en línea
          </Typography>
          <Button
            onClick={() => {
              setGoBack(true);
            }}
            variant="contained"
            startIcon={<Iconify icon="ri:arrow-go-back-fill" />}
          >
            Volver
          </Button>
        </Stack>
        <div className="layout">
          <PaymentForms idLibro1={idlibro} valor1={valor} usolibro={uso}/>
        </div>
      </Container>
    </>
  );
}
