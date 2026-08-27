import http from 'node:http';

let users = [{ id: 1, name: 'Ada Lovelace', email: 'ada@example.com' }];

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(body === undefined ? undefined : JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString();
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return undefined; }
};

const validUser = (value) => {
  return typeof value?.name === 'string' && value.name.trim().length > 0 &&
    typeof value.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);
};

const server = http.createServer(async (req, res) => {
  const method = req.method ?? 'GET';
  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
  if (method === 'GET' && pathname === '/health') return json(res, 200, { status: 'ok' });

  const match = pathname.match(/^\/api\/users(?:\/(\d+))?$/);
  if (!match) return json(res, 404, { error: 'route_not_found' });
  const id = match[1] ? Number(match[1]) : undefined;

  if (method === 'GET' && id) {
    const user = users.find((item) => item.id === id);
    return user ? json(res, 200, user) : json(res, 404, { error: 'user_not_found' });
  }
  if (method === 'POST' && !id) {
    const body = await readBody(req);
    if (!validUser(body)) return json(res, 422, { error: 'validation_error', fields: ['name', 'email'] });
    const user = { id: Math.max(...users.map((item) => item.id), 0) + 1, ...body };
    users.push(user);
    res.setHeader('Location', `/api/users/${user.id}`);
    return json(res, 201, user);
  }
  if (method === 'PUT' && id) {
    const body = await readBody(req);
    if (!validUser(body)) return json(res, 422, { error: 'validation_error', fields: ['name', 'email'] });
    const index = users.findIndex((item) => item.id === id);
    if (index < 0) return json(res, 404, { error: 'user_not_found' });
    users[index] = { id, ...body };
    return json(res, 200, users[index]);
  }
  if (method === 'DELETE' && id) {
    const index = users.findIndex((item) => item.id === id);
    if (index < 0) return json(res, 404, { error: 'user_not_found' });
    users.splice(index, 1);
    return json(res, 204);
  }
  return json(res, 405, { error: 'method_not_allowed' });
});

server.listen(3000, '127.0.0.1', () => console.log('Mock API listening on :3000'));
