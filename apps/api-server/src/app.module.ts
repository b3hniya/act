import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@act/database';
import { CustomerModule } from '@act/customer';

@Module({
  imports: [DatabaseModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
