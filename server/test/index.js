import request from 'supertest';
import {
  describe, beforeEach, it,
} from 'mocha';
import { assert } from 'chai';
import nock from 'nock';

import app from '../src/index.js';

const email = `test${Date.now()}@test.com`;

describe('express auth', () => {
  let server;

  beforeEach(() => {
    server = app;
  });
  it('responds to /', (done) => {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('404 everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

  it('respond to auth/register without params', (done) => {
    request(server)
      .post('/auth/register')
      .expect(400, done);
  });

  it('respond to auth/register with only email', (done) => {
    const payload = { email };
    request(server)
      .post('/auth/register')
      .send(payload)
      .expect(400, done);
  });

  it('respond to auth/register with params', (done) => {
    const payload = { email, password: 'pass', name: 'test' };
    request(server)
      .post('/auth/register')
      .send(payload)
      .expect(201, done);
  });

  it('respond to auth/register with same params', (done) => {
    const payload = { email, password: 'pass', name: 'test' };
    request(server)
      .post('/auth/register')
      .send(payload)
      .expect(403, done);
  });

  it('respond to auth/login without params', (done) => {
    request(server)
      .post('/auth/login')
      .expect(400, done);
  });

  it('respond to auth/login with only email', (done) => {
    const payload = { email };
    request(server)
      .post('/auth/login')
      .send(payload)
      .expect(400, done);
  });

  it('respond to auth/login with params', (done) => {
    const payload = { email, password: 'pass' };
    request(server)
      .post('/auth/login')
      .send(payload)
      .expect(200, done);
  });

  it('respond to auth/login with wrong params', (done) => {
    const payload = { email, password: email };
    request(server)
      .post('/auth/login')
      .send(payload)
      .expect(401, done);
  });
});

describe('Get locations', () => {
  let server;
  const locationResponse = {
    stations: [
      {
        coordinate: {
          type: 'WGS84',
          x: 47.547412,
          y: 7.589577,
        },
        distance: [null],
        icon: 'train',
        id: '8500010',
        name: 'Basel SBB',
        score: [null],
      },
    ],
  };

  beforeEach(() => {
    server = app;
  });
  beforeEach(() => {
    nock('http://transport.opendata.ch/v1/')
      .get('/locations?&query=Basel&type=station')
      .reply(200, JSON.stringify(locationResponse));
  });

  it('Get locations without params', (done) => {
    request(server)
      .get('/locations')
      .send({})
      .expect(403, done);
  });

  it('Get locations with params', async () => {
    const payload = { email, password: 'pass' };
    const resonseAuth = await request(server)
      .post('/auth/login')
      .send(payload);
    const { token } = resonseAuth.body.data;
    const resonse = await request(server)
      .get(`/locations?query=Basel&type=station&token=${token}`)
      .send();
    assert.equal(resonse.body.status, 'success');
    assert.equal(JSON.stringify(resonse.body.data), JSON.stringify(locationResponse));
  });
});
