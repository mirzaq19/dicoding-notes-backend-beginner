/* eslint-disable camelcase */
export const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  create_at,
  update_at,
}) => ({
  id,
  title,
  body,
  tags,
  createdAt: create_at,
  updatedAt: update_at,
});
