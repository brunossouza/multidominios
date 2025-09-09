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
import { AppConfig, ConfigService } from './services/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const httpClient = inject(HttpClient);
      const configService = inject(ConfigService);

      let domain = window.location.hostname;
      if (domain.startsWith('http://') || domain.startsWith('https://')) {
        domain = domain.split('//')[1];
      }

      console.log('Fetching config for domain:', domain);

      // You can modify the URL based on the domain if needed
      return firstValueFrom(
        httpClient
          .get(`http://localhost:3000/config`, {
            headers: {
              'x-tenant': domain,
            },
          })
          .pipe(
            tap((confg) => {
              console.log('Config loaded:', confg);
              configService.setConfig(confg as AppConfig);
            })
          )
      );
    }),
  ],
};
