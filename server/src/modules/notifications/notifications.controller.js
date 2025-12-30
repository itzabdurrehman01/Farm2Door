const { Controller, Get, Post, Body, Inject } = require('@nestjs/common');

@Controller('notifications')
class NotificationsController {
  constructor() {}
  @Inject('NOTIFICATIONS_SERVICE') svc;
  @Get()
  async findAll() { return this.svc.findAll(); }
  @Post()
  async create(@Body() dto) { return this.svc.create(dto); }
}

module.exports = { NotificationsController };
