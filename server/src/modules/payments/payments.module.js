const { Module } = require('@nestjs/common');
const { PaymentsController } = require('./payments.controller');
const { paymentsServiceProvider } = require('./payments.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentsController],
  providers: [paymentsServiceProvider]
})
class PaymentsModule {}

module.exports = { PaymentsModule };

