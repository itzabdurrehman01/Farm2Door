const { Module } = require('@nestjs/common');
const { InventoryController } = require('./inventory.controller');
const { inventoryServiceProvider } = require('./inventory.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [InventoryController],
  providers: [inventoryServiceProvider]
})
class InventoryModule {}

module.exports = { InventoryModule };

