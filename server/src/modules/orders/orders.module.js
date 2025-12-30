const { Module } = require('@nestjs/common');
const { OrdersController } = require('./orders.controller');
const { ordersServiceProvider } = require('./orders.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [ordersServiceProvider]
})
class OrdersModule {}

module.exports = { OrdersModule };

