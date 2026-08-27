import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    sustained_load: {
      executor: 'constant-vus',
      vus: 500,
      duration: '5m'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000']
  }
};

export default function () {
  const baseUrl = __ENV.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
  const response = http.get(`${baseUrl}/users/1`);
  check(response, {
    'status is 200': (res) => res.status === 200,
    'response is JSON': (res) => (res.headers['Content-Type'] || '').includes('application/json')
  });
  sleep(1);
}
