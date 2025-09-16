import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AppConfig, ConfigService } from './services/config.service';

describe('App', () => {
  let mockConfigService: jasmine.SpyObj<ConfigService>;
  const mockConfig: AppConfig = {
    companyName: 'Test Company',
    dbName: 'test_db',
    apiUrl: 'https://api.test.com',
    theme: 'light',
  };

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj('ConfigService', ['getConfig', 'setConfig']);
    mockConfigService.getConfig.and.returnValue(mockConfig);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: ConfigService, useValue: mockConfigService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.companyName).toBe('Test Company');
    expect(app.dbName).toBe('test_db');
    expect(app.apiUrl).toBe('https://api.test.com');
    expect(app.theme).toBe('light');
  });

  it('should initialize with config values', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(mockConfigService.getConfig).toHaveBeenCalled();
    expect(app.companyName).toBe(mockConfig.companyName);
    expect(app.dbName).toBe(mockConfig.dbName);
    expect(app.apiUrl).toBe(mockConfig.apiUrl);
    expect(app.theme).toBe(mockConfig.theme);
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Test Company');
  });
});
