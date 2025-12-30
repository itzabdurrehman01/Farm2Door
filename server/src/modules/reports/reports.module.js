const { Module } = require('@nestjs/common');
const { ReportsController } = require('./reports.controller');
const { reportsServiceProvider } = require('./reports.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [ReportsController],
  providers: [reportsServiceProvider]
})
class ReportsModule {}

module.exports = { ReportsModule };

