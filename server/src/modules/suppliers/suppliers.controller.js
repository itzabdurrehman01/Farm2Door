const { Controller, Get, Post, Body, Inject } = require('@nestjs/common');

@Controller('suppliers')
class SuppliersController {
  constructor() {}
  @Inject('SUPPLIERS_SERVICE') svc;

  @Get()
  async findAll() { return this.svc.findAll(); }

  @Post()
  async create(@Body() dto) { return this.svc.create(dto); }
}

module.exports = { SuppliersController };
