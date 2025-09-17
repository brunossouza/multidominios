import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  companyName: string;
  dbName: string;
  apiUrl: string;
  theme: string;

  constructor(private configService: ConfigService) {
    const config = this.configService.getConfig();
    if (config) {
      this.companyName = config.companyName;
      this.dbName = config.dbName;
      this.apiUrl = config.apiUrl;
      this.theme = config.theme;
      console.log('App initialized with config:', config);
    } else {
      this.companyName = 'Configuração padrão - Nenhum tenant identificado';
      this.dbName = 'default_db';
      this.apiUrl = 'http://localhost:3000/api';
      this.theme = 'light';
    }
  }
}
