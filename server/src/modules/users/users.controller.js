const { Controller, Get, Post, Body, Inject } = require('@nestjs/common');

@Controller('users')
class UsersController {
  constructor() {}
  @Inject('USERS_SERVICE') usersService;

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() dto) { return this.usersService.create(dto); }
}

module.exports = { UsersController };
