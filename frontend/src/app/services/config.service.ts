import { Injectable } from '@angular/core';

export interface AppConfig {
  companyName: string;
  dbName: string;
  apiUrl: string;
  theme: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig = null!;

  setConfig(config: AppConfig) {
    this.config = config;
  }

  getConfig(): AppConfig {
    return this.config;
  }
}
