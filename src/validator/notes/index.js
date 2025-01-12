import InvariantError from '../../exceptions/InvariantError.js';
import { NotePayloadSchema } from './schema.js';

export const NotesValidator = {
  validateNotePayload: (payload) => {
    const validateResult = NotePayloadSchema.validate(payload);
    if (validateResult.error)
      throw new InvariantError(validateResult.error.message);
  },
};
