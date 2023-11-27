import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  userID: faker.datatype.number(),
  isInMora: faker.datatype.boolean(),
  status: sample(['active', 'inactivo']),
}));

export default users;
