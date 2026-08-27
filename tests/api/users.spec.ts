import { expect, test } from '@playwright/test';

test.describe('Users API', () => {
  test('GET /api/users/:id returns status, headers and body', async ({ request }) => {
    const response = await request.get('/api/users/1');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    await expect(response.json()).resolves.toEqual({ id: 1, name: 'Ada Lovelace', email: 'ada@example.com' });
  });

  test('POST, PUT and DELETE a user through the full HTTP lifecycle', async ({ request }) => {
    const created = await request.post('/api/users', { data: { name: 'Cesar Bulzico', email: 'cesar@example.com' } });
    expect(created.status()).toBe(201);
    expect(created.headers()['location']).toMatch(/^\/api\/users\/\d+$/);
    const id = (await created.json()).id;

    const updated = await request.put(`/api/users/${id}`, { data: { name: 'Cesar A. Bulzico', email: 'cesar@example.com' } });
    expect(updated.status()).toBe(200);
    await expect(updated.json()).resolves.toEqual({ id, name: 'Cesar A. Bulzico', email: 'cesar@example.com' });

    const deleted = await request.delete(`/api/users/${id}`);
    expect(deleted.status()).toBe(204);
    expect(deleted.headers()['content-type']).toContain('application/json');
  });

  test('rejects invalid and malformed data, unknown resources and unsupported methods', async ({ request }) => {
    const missingFields = await request.post('/api/users', { data: { name: '' } });
    expect(missingFields.status()).toBe(422);
    await expect(missingFields.json()).resolves.toEqual({ error: 'validation_error', fields: ['name', 'email'] });

    const malformed = await request.post('/api/users', { headers: { 'content-type': 'application/json' }, data: '{bad-json' });
    expect(malformed.status()).toBe(422);

    expect((await request.get('/api/users/9999')).status()).toBe(404);
    expect((await request.patch('/api/users/1')).status()).toBe(405);
  });
});
