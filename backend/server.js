const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`Serveur Dossier RH démarré sur http://0.0.0.0:${port}`);
});