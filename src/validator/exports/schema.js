import Joi from 'joi';

export const ExportNotesPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
