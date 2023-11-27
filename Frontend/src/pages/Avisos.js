import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter, map } from 'lodash';
import { sentenceCase } from 'change-case';
import Cookies from 'js-cookie';
import { darken } from 'polished';
import swal from 'sweetalert';
import {
  Card,
  Table,
  Stack,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  CircularProgress,
  Avatar,
} from '@mui/material';
import EditUserForm from '../components/editUserForm/EditUserForm';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import USERLIST from '../_mock/user';
import RegisterForm from '../components/registerForm';
import account from '../_mock/account';

const TABLE_HEAD = [
  { id: 'titulo', label: 'Mi libro', alignRight: false },
  { id: 'genero', label: 'Intercambiar por ', alignRight: false },
  { id: 'autor', label: 'Estado del intercambio', alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => null.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('idlibro');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [listalibros, setListalibros] = useState([]);
  const [goToHome, setGoToHome] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => null);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const [secondAvatarImage, setSecondAvatarImage] = useState('');

  const handleClick = () => {
    const selectedIndex = selected.indexOf(null);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, null);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  const handleAceptar = (idaviso) => {
    const url = 'http://127.0.0.1:8000/api/aceptarintercambio';
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_aviso: idaviso }), // Enviar el idaviso en el cuerpo de la solicitud
    })
      .then((response) => response.json())
      .then((data2) => {
        // Mostrar ventana emergente de éxito
        swal({
          title: 'Éxito',
          text: data2.success, // Mostrar el mensaje recibido en la respuesta
          icon: 'success',
          button: {
            text: 'Aceptar',
            className: 'swal-button--success',
            icon: 'ic_blog', // Ícono de intercambio (debes proporcionar el nombre correcto del ícono)
          },
        }).then(() => {
          window.location.reload(); // Recargar la página después de hacer clic en "Aceptar"
        });
      })
      .catch((error) => {
        console.error('Error al aceptar el intercambio:', error);
      });
  };

  const handleDenegar = (idaviso) => {
    const url = 'http://127.0.0.1:8000/api/denegarintercambio';
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_aviso: idaviso }), // Enviar el idaviso en el cuerpo de la solicitud
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
          window.location.reload(); // Recargar la página después de hacer clic en "Aceptar"
        });
      })
      .catch((error) => {
        console.error('Error al aceptar el intercambio:', error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(listalibros, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const url = 'http://127.0.0.1:8000/api/avisosintercambios';

  const [data, setData] = useState(null);

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
            setGoToHome(true);
          } else {
            swal.close();
            setGoToHome(true);
          }
        })
        .catch((error) => {
          console.log(error);
          swal.close();
          setGoToHome(true);
        });
    }

    if (Cookies.get('nombre')) {
      // La cookie existe
      fetchCatalogo();
      console.log('La cookie existe');
    } else {
      // La cookie no existe
      setGoToHome(true);
      console.log('La cookie no existe');
    }
  }, []);

  if (goToHome) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      <Helmet>
        <title>Página Principal</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Solicitudes de Intercambios
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      estado,
                      idlibrocliente,
                      idlibrousuario,
                      titulolibrocliente,
                      titulolibrousuario,
                      idaviso,
                      emailcliente,
                      emailusuario,
                      imagencliente,
                      imagenvendedor,
                    } = row;

                    const vende = emailcliente.replace(/\.com$/, '');
                    const vende2 = emailusuario.replace(/\.com$/, '');

                    const urlA = `/static/librosMedia/${imagencliente}`;
                    const urlA2 = `/static/librosMedia/${imagenvendedor}`;
                    // si no existe
                    const urlA3 = `/static/librosMedia/${titulolibrocliente}-${vende2}.jpg`;
                    const urlA4 = `/static/librosMedia/${titulolibrousuario}-${vende}.jpg`;

                    return (
                      <TableRow
                        hover
                        key={idlibrocliente}
                        tabIndex={-1}
                        selected={null}
                        sx={{ '& > *': { padding: '8px' } }}
                      >
                        <TableCell align="left">
                          <Avatar
                            alt={'titulo'}
                            src={urlA}
                            variant="rounded"
                            style={{
                              width: '20vh',
                              height: '30vh',
                            }}
                          />
                          {titulolibrousuario}
                        </TableCell>
                        <TableCell align="left">
                          <Avatar
                            alt={'titul'}
                            src={urlA2}
                            variant="rounded"
                            style={{
                              width: '20vh',
                              height: '30vh',
                            }}
                          />
                          {titulolibrocliente}
                        </TableCell>

                        <TableCell align="left">
                          {estado === 'Solicitado' ? (
                            <>
                              <Button
                                sx={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                                onClick={() => handleAceptar(idaviso)}
                              >
                                Aceptar
                              </Button>
                              <Button
                                sx={{ backgroundColor: 'red', color: 'white' }}
                                onClick={() => handleDenegar(idaviso)}
                              >
                                Denegar
                              </Button>
                            </>
                          ) : (
                            estado
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-fill'} sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>
    </>
  );
}
