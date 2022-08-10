import request from './lib/index';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request.get('/').expect(200).expect('Hello World!');
  });
});
