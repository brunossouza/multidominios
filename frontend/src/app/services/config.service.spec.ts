import { TestBed } from '@angular/core/testing';
import { AppConfig, ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get config', () => {
    const mockConfig: AppConfig = {
      companyName: 'Test Company',
      dbName: 'test_db',
      apiUrl: 'https://api.test.com',
      theme: 'dark',
    };

    service.setConfig(mockConfig);
    const retrievedConfig = service.getConfig();

    expect(retrievedConfig).toEqual(mockConfig);
    expect(retrievedConfig.companyName).toBe('Test Company');
    expect(retrievedConfig.dbName).toBe('test_db');
    expect(retrievedConfig.apiUrl).toBe('https://api.test.com');
    expect(retrievedConfig.theme).toBe('dark');
  });

  it('should update config when setConfig is called multiple times', () => {
    const initialConfig: AppConfig = {
      companyName: 'Initial Company',
      dbName: 'initial_db',
      apiUrl: 'https://api.initial.com',
      theme: 'light',
    };

    const updatedConfig: AppConfig = {
      companyName: 'Updated Company',
      dbName: 'updated_db',
      apiUrl: 'https://api.updated.com',
      theme: 'dark',
    };

    service.setConfig(initialConfig);
    expect(service.getConfig()).toEqual(initialConfig);

    service.setConfig(updatedConfig);
    expect(service.getConfig()).toEqual(updatedConfig);
    expect(service.getConfig().companyName).toBe('Updated Company');
  });

  it('should handle partial config updates', () => {
    const config: AppConfig = {
      companyName: 'Test Company',
      dbName: 'test_db',
      apiUrl: 'https://api.test.com',
      theme: 'light',
    };

    service.setConfig(config);
    const retrievedConfig = service.getConfig();

    expect(retrievedConfig).toBeDefined();
    expect(Object.keys(retrievedConfig)).toHaveSize(4);
    expect(retrievedConfig.companyName).toBeDefined();
    expect(retrievedConfig.dbName).toBeDefined();
    expect(retrievedConfig.apiUrl).toBeDefined();
    expect(retrievedConfig.theme).toBeDefined();
  });

  it('should maintain config state between calls', () => {
    const config: AppConfig = {
      companyName: 'Persistent Company',
      dbName: 'persistent_db',
      apiUrl: 'https://api.persistent.com',
      theme: 'blue',
    };

    service.setConfig(config);

    // Call getConfig multiple times to ensure state is maintained
    const firstCall = service.getConfig();
    const secondCall = service.getConfig();
    const thirdCall = service.getConfig();

    expect(firstCall).toEqual(config);
    expect(secondCall).toEqual(config);
    expect(thirdCall).toEqual(config);
    expect(firstCall).toEqual(secondCall);
    expect(secondCall).toEqual(thirdCall);
  });
});
