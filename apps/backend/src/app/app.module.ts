import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DatabaseModule } from '../database/database.module';
import { CsbRequestsModule } from '../csb-requests/csb-requests.module';
import { CsbApiModule } from '../csb-api/csb-api.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-first: schema is generated from decorated classes and committed
      // to source (see docs/api-design-log.md) rather than gitignored.
      autoSchemaFile: join(process.cwd(), 'apps/backend/src/schema.gql'),
      sortSchema: true,
      // GraphQL is served at /graphql, separate from the REST API's /api prefix.
      path: '/graphql',
    }),
    DatabaseModule,
    CsbRequestsModule,
    CsbApiModule,
    AuthModule,
  ],
})
export class AppModule {}
