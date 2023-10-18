require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');
module.exports.firebase = initializeApp();
const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const { authenticateRequestor } = require('./middleware')

const app = express();

app.use(express.json());

app.use(morgan(':method :url :status - :response-time ms :remote-addr'));

app.use((req, res, next) => authenticateRequestor(req, res, next));
app.get('/', (req, res) => {
  res.send('Hello world.');
});

app.use('/api', routes);

app.all('*', (req, res) => {
  console.error(`Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).send({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

module.exports.server = app.listen(PORT);
module.exports.app = app;
console.log(`Listening on port ${PORT}`);