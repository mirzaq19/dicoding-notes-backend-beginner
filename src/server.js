import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import NotePlugin from './api/notes/index.js';
import NotesService from './services/postgres/NotesService.js';
import { NotesValidator } from './validator/notes/index.js';
import UserPlugin from './api/users/index.js';
import UsersService from './services/postgres/UsersService.js';
import { UsersValidator } from './validator/users/index.js';
import AuthenticationPlugin from './api/authentications/index.js';
import AuthenticationsService from './services/postgres/AuthenticationsService.js';
import { AuthenticationsValidator } from './validator/authentications/index.js';
import TokenManager from './tokenize/TokenManager.js';
import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: [
          'http://notesapp-v1.dicodingacademy.com',
          'http://notesapp-v2.dicodingacademy.com',
        ],
      },
    },
  });

  await server.register({
    plugin: Jwt,
  });

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: NotePlugin,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: UserPlugin,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: AuthenticationPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
