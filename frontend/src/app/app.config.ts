import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { routes } from './app.routes';
import { AppConfig, ConfigService } from './config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const httpClient = inject(HttpClient);
      const domain = window.location.hostname;
      const configService = inject(ConfigService);
      console.log('Current domain:', domain);
      // You can modify the URL based on the domain if needed
      return firstValueFrom(
        httpClient.get(`http://${domain}:3000/config`).pipe(
          tap((confg) => {
            console.log('Config loaded:', confg);
            configService.setConfig(confg as AppConfig);
          })
        )
      );
    }),
  ],
};
