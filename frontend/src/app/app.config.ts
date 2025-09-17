import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, tap } from 'rxjs';
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

      // O header Origin será enviado automaticamente pelo navegador
      // O backend extrairá o domínio a partir do Origin
      return firstValueFrom(
        httpClient
          .get(`http://localhost:3000/config`)
          .pipe(
            tap((confg) => {
              if (confg) {
                console.log('Config loaded:', confg);
                configService.setConfig(confg as AppConfig);
              } else {
                console.error('No config received from backend');
              }
            }),
            catchError((error) => {
              console.error('Error loading config:', error);
              throw error;
            }),
          )
      );
    }),
  ],
};
