import {v1 as uuid} from 'uuid';

export const state = {
  project: null
};

export const recents = [
  {
    name: 'sample1',
    id: uuid(),
    lastModified: new Date('2017')
  },
  {
    name: 'sample2',
    id: uuid(),
    lastModified: new Date('2018')
  },
  {
    name: 'sample3',
    id: uuid(),
    lastModified: new Date('2019')
  }
];