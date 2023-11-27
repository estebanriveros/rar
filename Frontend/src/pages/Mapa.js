import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import MapView from './MapView';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  return (
    <>
      <Helmet>
        <title> Libros Cercanos </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Mapa de Libros Cercanos
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={12}>
            <div style={{ height: '70vh', maxHeight: '100px' }}>
              <MapView />
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
