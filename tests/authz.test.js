// Authorization regression tests (security audit 2026-11).
// Uses real JWTs so authenticateJWT runs for real; only the DB pool is mocked.
process.env.JWT_SECRET = 'authz-test-secret-0123456789';

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const mockQuery = jest.fn();
jest.mock('../routes/db.js', () => ({
  connect: jest.fn(() => Promise.resolve({ query: mockQuery, release: jest.fn() }))
}));
const pool = require('../routes/db.js');

const app = express();
app.use(express.json());
app.use('/api/admin', require('../routes/api/admin'));
app.use('/api/users', require('../routes/api/users'));
app.use('/api/meals', require('../routes/api/meals'));
app.use('/api/chat', require('../routes/api/chat'));
app.use('/api/notifications', require('../routes/api/notifications'));

const tokenFor = id => 'Bearer ' + jwt.sign({ id, name: 'u' + id }, process.env.JWT_SECRET, { expiresIn: 60 });

beforeEach(() => {
  mockQuery.mockReset();
  pool.connect.mockClear();
  delete process.env.ADMIN_USER_IDS;
  delete process.env.FACEBOOK_APP_ID;
  delete process.env.FACEBOOK_APP_SECRET;
});

describe('admin API', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('rejects everyone when ADMIN_USER_IDS is unset', async () => {
    const res = await request(app).get('/api/admin/users').set('Authorization', tokenFor(1));
    expect(res.status).toBe(403);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('rejects a non-admin user', async () => {
    process.env.ADMIN_USER_IDS = '7';
    const res = await request(app).delete('/api/admin/users/3').set('Authorization', tokenFor(5));
    expect(res.status).toBe(403);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('allows a listed admin', async () => {
    process.env.ADMIN_USER_IDS = '2, 7';
    mockQuery.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/admin/users').set('Authorization', tokenFor(7));
    expect(res.status).toBe(200);
  });
});

describe('Facebook login', () => {
  it('is disabled when the app secret is not configured', async () => {
    const res = await request(app).post('/api/users/loginFB')
      .send({ email: 'victim@example.com', name: 'x', accessToken: 'anything' });
    expect(res.status).toBe(503);
    expect(pool.connect).not.toHaveBeenCalled();
  });

  it('issues no token for an unverified access token', async () => {
    process.env.FACEBOOK_APP_ID = '123';
    process.env.FACEBOOK_APP_SECRET = 'secret';
    const realFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ data: { is_valid: false } }) }));
    try {
      const res = await request(app).post('/api/users/loginFB')
        .send({ email: 'victim@example.com', name: 'x', accessToken: 'forged' });
      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
      expect(pool.connect).not.toHaveBeenCalled();
    } finally {
      global.fetch = realFetch;
    }
  });

  it('rejects a token issued for another Facebook app', async () => {
    process.env.FACEBOOK_APP_ID = '123';
    process.env.FACEBOOK_APP_SECRET = 'secret';
    const realFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ data: { is_valid: true, app_id: '999', user_id: '1' } })
    }));
    try {
      const res = await request(app).post('/api/users/loginFB').send({ accessToken: 'other-app' });
      expect(res.status).toBe(401);
      expect(pool.connect).not.toHaveBeenCalled();
    } finally {
      global.fetch = realFetch;
    }
  });
});

describe('ownership checks', () => {
  it('scopes meal deletion to the host and 404s for someone else\'s meal', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const res = await request(app).delete('/api/meals/42').set('Authorization', tokenFor(5));
    expect(res.status).toBe(404);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('host_id=$2'), ['42', 5]);
  });

  it('scopes meal updates to the host', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const res = await request(app).put('/api/meals').set('Authorization', tokenFor(5))
      .send({ id: 42, name: 'Renamed meal', guest_count: 3 });
    expect(res.status).toBe(404);
    expect(mockQuery.mock.calls[0][1]).toEqual(['Renamed meal', 3, 42, 5]);
  });

  it('creates meals as the authenticated user, ignoring body host_id', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });
    const res = await request(app).post('/api/meals').set('Authorization', tokenFor(5)).send({
      name: 'Test Meal', description: 'A delicious test meal', date: Date.now() + 86400000,
      address: '456 Test Avenue', location: { lng: 34.8, lat: 32.1 },
      host_id: 99, guest_count: 3, type: 1, visibility: 1
    });
    expect(res.status).toBe(200);
    expect(mockQuery.mock.calls[0][1][5]).toBe(5);
  });

  it('forbids reading another user\'s chats', async () => {
    const list = await request(app).get('/api/chat/9').set('Authorization', tokenFor(5));
    const thread = await request(app).get('/api/chat/user/9/5').set('Authorization', tokenFor(5));
    expect(list.status).toBe(403);
    expect(thread.status).toBe(403);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('allows reading your own chats', async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/chat/5').set('Authorization', tokenFor(5));
    expect(res.status).toBe(200);
  });

  it('forbids reading another user\'s notifications or my-meals', async () => {
    const n = await request(app).get('/api/notifications/9').set('Authorization', tokenFor(5));
    const m = await request(app).get('/api/meals/my/9').set('Authorization', tokenFor(5));
    expect(n.status).toBe(403);
    expect(m.status).toBe(403);
  });
});
