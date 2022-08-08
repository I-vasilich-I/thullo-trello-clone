import * as request from 'supertest';

const HOST = 'localhost:5000';

const _request = request(HOST);

export default _request;
