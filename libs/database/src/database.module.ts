import { Global, Module } from '@nestjs/common';
import { DRIZZLE } from './constants.js';
import { createDrizzleClient } from './client.js';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        return createDrizzleClient(databaseUrl);
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
