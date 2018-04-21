import { AssertionError } from 'assert';

import { init } from '../helpers';

describe('router', () => {
  it('new Router(), should throw error', async () => {
    try {
      await init();
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
