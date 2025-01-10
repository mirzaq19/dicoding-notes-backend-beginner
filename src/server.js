import Hapi from '@hapi/hapi';
import NotePlugin from './api/notes/index.js';
import NotesService from './services/inMemory/NoteService.js';

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['http://notesapp-v1.dicodingacademy.com'],
      },
    },
  });

  await server.register({
    plugin: NotePlugin,
    options: {
      service: notesService,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
