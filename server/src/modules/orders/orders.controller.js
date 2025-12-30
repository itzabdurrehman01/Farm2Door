const { Controller, Get, Post, Body, Inject } = require('@nestjs/common');

@Controller('orders')
class OrdersController {
  constructor() {}
  @Inject('ORDERS_SERVICE') ordersService;

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  async create(@Body() dto) { return this.ordersService.create(dto); }
}

module.exports = { OrdersController };
