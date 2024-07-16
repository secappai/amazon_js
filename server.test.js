const request = require('supertest');
const app = require('./server');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

describe('Registration', () => {
  beforeEach(async () => {
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('CREATE TABLE users (email TEXT PRIMARY KEY, password TEXT)');
        resolve();
      });
    });
  });

  afterEach(async () => {
    await new Promise((resolve) => {
      db.serialize(() => {
        db.run('DROP TABLE users');
        resolve();
      });
    });
    db.close();
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Registration successful');
  });

  test('should not register a user with an existing email', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already registered');
  });

  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
  });

  test('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
