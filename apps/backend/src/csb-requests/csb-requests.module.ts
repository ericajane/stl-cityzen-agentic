import { Module } from '@nestjs/common';
import { CsbRequestsController } from './csb-requests.controller';
import { CsbRequestsService } from './csb-requests.service';
import { CsbApiModule } from '../csb-api/csb-api.module';
import { CsbRequestsResolver } from './graphql/csb-requests.resolver';
import { DateTimeScalar } from './graphql/date-time.scalar';

@Module({
  imports: [CsbApiModule],
  controllers: [CsbRequestsController],
  providers: [CsbRequestsService, CsbRequestsResolver, DateTimeScalar],
})
export class CsbRequestsModule {}
