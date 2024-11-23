import { nanoid } from 'nanoid';
import notes from './notes.js';

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: { notes },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((note) => note.id === id);

  if (note) {
    return {
      status: 'success',
      data: { note },
    };
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    })
    .code(404);

  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  const note = notes.find((note) => note.id === id);

  if (!note)
    return h
      .response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      })
      .code(404);

  const updatedAt = new Date().toISOString();
  notes.map((note) => {
    if (note.id === id) {
      note.title = title;
      note.body = body;
      note.tags = tags;
      note.updatedAt = updatedAt;
    }

    return note;
  });

  const response = h
    .response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    })
    .code(200);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((note) => note.id === id);

  if (!note)
    return h
      .response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
      })
      .code(404);

  const index = notes.findIndex((note) => note.id === id);
  notes.splice(index, 1);

  const response = h
    .response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    })
    .code(200);

  return response;
};

export {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
