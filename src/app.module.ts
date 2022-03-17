import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

console.log(join(__dirname, '..', 'client'));

@Module({
  imports: [
    AuthModule,
    TicketModule,
    UserModule,
    TypeOrmModule.forRoot(
      process.env.NODE_ENV == 'production'
        ? {
            type: 'postgres',
            url: process.env.URI,
            ssl: { rejectUnauthorized: false },
          }
        : {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'root',
            database: 'ticketing_system',
            autoLoadEntities: true,
            synchronize: true, // true only for devlopment
          },
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/build'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
