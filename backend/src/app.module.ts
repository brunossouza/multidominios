import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMiddleware } from './tenant-middleware/tenant-middleware.middleware';
import { TenantConfigService } from './tenant-config/tenant-config.service';
import { TenantConfigController } from './tenant-config/tenant-config.controller';

@Module({
  imports: [],
  controllers: [AppController, TenantConfigController],
  providers: [AppService, TenantConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
