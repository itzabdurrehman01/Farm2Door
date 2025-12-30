const { Module } = require('@nestjs/common');
const { UsersController } = require('./users.controller');
const { usersServiceProvider } = require('./users.service');
const { DatabaseModule } = require('../../database.module');

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [usersServiceProvider]
})
class UsersModule {}

module.exports = { UsersModule };

