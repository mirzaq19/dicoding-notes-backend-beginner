/* eslint-disable camelcase */
export const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  username,
  create_at,
  update_at,
}) => ({
  id,
  title,
  body,
  tags,
  username,
  createdAt: create_at,
  updatedAt: update_at,
});
