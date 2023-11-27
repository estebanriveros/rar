import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import Inicio from './pages/Inicio';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Mapa from './pages/Mapa';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import MisCompras from './pages/MisCompras';
import MisVentas from './pages/MisVentas';
import Perfil from './pages/Perfil';
import PerfilVendedor from './pages/PerfilVendedor';
import Payment from './pages/Payment';
import PaymentPage from './pages/PaymentPage';
import PropertyRegistry from './pages/PropertyRegistry';
import AgregarLibro from './pages/AgregarLibro';
import MapView from './pages/MapView';
import EditUser from './pages/EditUser';
import InterfaceBook from './pages/InterfaceBook';
import Avisos  from'./pages/Avisos';
import Intercambio from './pages/interfaceIntercambio';
import  Disponibles from './pages/MisLibros'

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/inicio" />, index: true },
        { path: 'mapa', element: <Mapa /> },
        { path: 'inicio', element: <Inicio /> },
        { path: 'miscompras', element: <MisCompras /> },
        { path: 'misventas', element: <MisVentas /> },
        { path: 'perfil', element: <Perfil /> },
        { path: 'payment', element: <Payment /> },
        // { path: 'onlinepayment', element: <PaymentPage /> },
        { path: 'agregarlibro', element: <AgregarLibro /> },
        { path: 'book', element: <InterfaceBook /> },
        { path: 'book/:name/:autor/:vendedorNombre/:descripcion/:disponible/:valor/:idlibro/:urlImagen/:calificacion', element: <InterfaceBook /> },
        { path: 'onlinepayment/:idlibro/:valor/:uso', element: <PaymentPage /> },
        { path: 'perfilvendedor', element:<PerfilVendedor/>},
        { path: 'perfilvendedor/:idlibro', element:<PerfilVendedor/>},
        { path: 'avisos', element:<Avisos/>},
        {path :  'intercambios/:libro/:name/:urlImagen', element:<Intercambio/>},
        {path :  'disponibles', element:< Disponibles/>},


      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'map',
      element: <MapView />,
    },
    {
      path: '/home',
      element: <HomePage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/home" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/register',
      element: <Register />,
    },

    {
      path: '/propertyRegister',
      element: <PropertyRegistry />,
    },
    {
      path: 'edituser',
      element: <EditUser />,
    },
    {
      path: 'book',
      element: <InterfaceBook />,
    },
  ]);

  return routes;
}
