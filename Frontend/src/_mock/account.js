// ----------------------------------------------------------------------

const account = {
  displayName: '',
  tipoDocumento: '',
  cedula: '',
  email: '',
  photoURL: '/static/images/avatars/avatar_21.jpg',
  telefono: '',
  ciudad: '',
  direccion: '',
  latitud: '',
  longitud: '',

  listalibros: [],

  lista: [
    {
      cedula: '1002343456',
      nombre: 'Ana',
      telefono: '3014506070',
      correo_electronico: 'ana@gmail.com',
      estado_usuario: 'activo',
      id_tipo_usuario_id: 3,
      tipo_documento: 'CC',
    },
    {
      cedula: '70000',
      nombre: 'Julio Figueroa',
      telefono: '3045010',
      correo_electronico: 'julio@gmail.com',
      estado_usuario: 'inactivo',
      id_tipo_usuario_id: 3,
      tipo_documento: 'CC',
    },
    {
      cedula: '1002340506',
      nombre: 'Felipe Valencia',
      telefono: '3025060',
      correo_electronico: 'felipe@gmail.com',
      estado_usuario: 'activo',
      id_tipo_usuario_id: 3,
      tipo_documento: '',
    },
  ],
  listaCliente: [
    {
      cedula: '1002343456',
      nombre: 'Ana',
      telefono: '3014506070',
      correo_electronico: 'ana@gmail.com',
      estado_usuario: 'activo',
      id_tipo_usuario_id: 3,
      tipo_documento: 'CC',
    },
    {
      cedula: '70000',
      nombre: 'Julio Figueroa',
      telefono: '3045010',
      correo_electronico: 'julio@gmail.com',
      estado_usuario: 'inactivo',
      id_tipo_usuario_id: 3,
      tipo_documento: 'CC',
    },
  ],
  listaCoordenadas: [],
  facturas: [],
};

export default account;
