require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');

const app = express();

app.use(express.json());

app.use(morgan(':method :url :status - :response-time ms :remote-addr'));

app.get('/', (req, res) => {
  res.send('Hello world.');
});

app.use('/api', routes);

app.all('*', (req, res) => {
  console.error(`Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).send({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT);
console.log(`Listening on port ${PORT}`);

