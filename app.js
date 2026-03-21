const express = require('express');
const app = express();

const globalRouter = require('./router');

app.use(express.json());

// default route
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// user routes
app.use('/api/users', globalRouter);

app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${process.env.SERVER_PORT}`);
});