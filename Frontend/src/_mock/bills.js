import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const bills = [...Array(4)].map((_, index) => ({
  id: faker.datatype.uuid(),
  billID: faker.datatype.number(),
  value: faker.commerce.price(80000,300000,2,'$ '),
  status: sample(['pagado', 'pendiente']),
  expirationDate: faker.date.month(),
  expeditionDate: faker.date.month(),
}));

export default bills;
