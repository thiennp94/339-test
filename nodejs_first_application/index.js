import express from 'express';
import { collectDefaultMetrics, register, Counter, Histogram } from 'prom-client';

collectDefaultMetrics();

const app = express();

const counter = new Counter({
  name: 'HelloRouteCount',
  help: 'metric_help',
});

const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});

app.get('/', (req, res) => {
  //httpRequestDurationMicroseconds.labels(req.route.path).observe(responseTimeInMs);
  counter.inc();
  res.send('Hello Prom!')
});

app.get('/metrics', async (_req, res) => {
	try {
		//httpRequestDurationMicroseconds.labels(req.route.path).observe(responseTimeInMs);
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
		counter.inc();
	} catch (err) {
		res.status(500).end(err);
	}
});

app.listen(4001, '0.0.0.0');

console.log('Server is running...');