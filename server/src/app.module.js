const { Module } = require('@nestjs/common');
const { DatabaseModule } = require('./database.module');

@Module({ imports: [DatabaseModule] })
class AppModule {}

module.exports = { AppModule };
