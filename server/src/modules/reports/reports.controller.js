const { Controller, Get, Inject } = require('@nestjs/common');

@Controller('reports')
class ReportsController {
  constructor() {}
  @Inject('REPORTS_SERVICE') svc;
  @Get('summary')
  async summary() { return this.svc.summary(); }
}

module.exports = { ReportsController };
