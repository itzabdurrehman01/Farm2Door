const { Controller, Get, Post, Body, Inject } = require('@nestjs/common');

@Controller('products')
class ProductsController {
  constructor() {}
  @Inject('PRODUCTS_SERVICE') productsService;

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Post()
  async create(@Body() dto) { return this.productsService.create(dto); }
}

module.exports = { ProductsController };
