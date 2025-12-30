const { Controller, Get, Post, Body, Inject } = require('@nestjs/common');

@Controller('inventory')
class InventoryController {
  constructor() {}
  @Inject('INVENTORY_SERVICE') svc;
  @Get()
  async findAll() { return this.svc.findAll(); }
  @Post()
  async upsert(@Body() dto) { return this.svc.upsert(dto); }
}

module.exports = { InventoryController };
