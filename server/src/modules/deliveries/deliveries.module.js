const { Module } = require('@nestjs/common');
const { DeliveriesController } = require('./deliveries.controller');
const { deliveriesServiceProvider } = require('./deliveries.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [DeliveriesController],
  providers: [deliveriesServiceProvider]
})
class DeliveriesModule {}

module.exports = { DeliveriesModule };

