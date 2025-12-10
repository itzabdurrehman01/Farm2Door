const app = require('./app');
const http = require('http');
const { PORT = 4000 } = process.env;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
