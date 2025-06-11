import express from 'express';
import routes from './routes/index.js';

const app = express();

app.use(express.static('../frontend'))

app.use(express.json());

async function init() {
  routes(app);
}

init();

const port = 3011;
app.listen(port, () => {
  console.log(`SAFE PATH running on ${port}!`);
});
