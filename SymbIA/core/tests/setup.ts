import 'reflect-metadata';
import { beforeEach } from 'vitest';
import { container } from 'tsyringe';

// Clear container before each test
beforeEach(() => {
    container.clearInstances();
});
