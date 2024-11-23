import Hapi from '@hapi/hapi';
import routes from './routes.js';

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    // eslint-disable-next-line no-undef
    host: process.env.NODE_ENV === 'production'? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['http://notesapp-v1.dicodingacademy.com'],
      }
    }
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
