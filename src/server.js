import 'dotenv/config';
import Hapi from '@hapi/hapi';
import NotePlugin from './api/notes/index.js';
import NotesService from './services/postgres/NoteService.js';
import { NotesValidator } from './validator/notes/index.js';
import UserPlugin from './api/users/index.js';
import UserService from './services/postgres/UserService.js';
import { UsersValidator } from './validator/users/index.js';
import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const notesService = new NotesService();
  const userService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['http://notesapp-v1.dicodingacademy.com'],
      },
    },
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
        service: userService,
        validator: UsersValidator,
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
