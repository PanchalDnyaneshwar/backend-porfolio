import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUri'),
        serverSelectionTimeoutMS: 10_000,
        maxPoolSize: 10,
        maxIdleTimeMS: 60_000,
      }),
    }),
  ],
})
export class DatabaseModule {}
