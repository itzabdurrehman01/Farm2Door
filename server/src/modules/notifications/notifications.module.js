const { Module } = require('@nestjs/common');
const { NotificationsController } = require('./notifications.controller');
const { notificationsServiceProvider } = require('./notifications.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [notificationsServiceProvider]
})
class NotificationsModule {}

module.exports = { NotificationsModule };

