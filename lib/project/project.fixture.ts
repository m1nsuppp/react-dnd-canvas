import { nanoid } from 'nanoid';
import { Project } from './project.model';
import { conceptsFixture } from '../concept/concept.fixture';

export const projectFixture: Project = {
  id: nanoid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'test',
  concepts: conceptsFixture,
};
