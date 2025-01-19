export default class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h
      .response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: { userId },
      })
      .code(201);
    return response;
  }

  async getUsersHandler(request, h) {
    const { username = '' } = request.query;
    const users = await this._service.getUsers({ username });
    return h.response({
      status: 'success',
      data: {
        users,
      },
    });
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    return h.response({
      status: 'success',
      data: {
        user,
      },
    });
  }
}
