import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/images/avatars/avatar_${index + 1}.jpg`,
  titulo: faker.name.fullName(),
  userID: faker.datatype.number(),
  isInMora: faker.datatype.boolean(),
  status: 'inactivo',
  role: 'Cliente',
}));

export default users;
