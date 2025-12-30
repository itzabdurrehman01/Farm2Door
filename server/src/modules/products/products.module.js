const { Module } = require('@nestjs/common');
const { ProductsController } = require('./products.controller');
const { productsServiceProvider } = require('./products.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [productsServiceProvider]
})
class ProductsModule {}

module.exports = { ProductsModule };

