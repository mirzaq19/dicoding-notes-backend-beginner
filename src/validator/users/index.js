import { UserPayloadSchema } from './schema.js';
import InvariantError from '../../exceptions/InvariantError.js';

export const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
