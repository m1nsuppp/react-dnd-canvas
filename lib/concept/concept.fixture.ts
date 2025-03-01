import { nanoid } from 'nanoid';
import { type Concept } from './concept.model';

export const conceptsFixture: Concept[] = [
  {
    id: nanoid(),
    image: {
      url: '/a.avif',
      width: 653,
      height: 432,
    },
    boundingBox: {
      xmin: 0,
      ymin: 0,
      xmax: 1,
      ymax: 1,
    },
    position: {
      x: 0.5,
      y: 0.5,
    },
    scale: 1,
    rotation: 0,
  },
  {
    id: nanoid(),
    image: {
      url: '/b.png',
      width: 178,
      height: 809,
    },
    boundingBox: {
      xmin: 0,
      ymin: 0,
      xmax: 1,
      ymax: 1,
    },
    position: {
      x: 0.5,
      y: 0.5,
    },
    scale: 1,
    rotation: 0,
  },
];
