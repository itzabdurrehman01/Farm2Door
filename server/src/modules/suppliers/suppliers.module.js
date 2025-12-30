const { Module } = require('@nestjs/common');
const { SuppliersController } = require('./suppliers.controller');
const { suppliersServiceProvider } = require('./suppliers.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [SuppliersController],
  providers: [suppliersServiceProvider]
})
class SuppliersModule {}

module.exports = { SuppliersModule };

