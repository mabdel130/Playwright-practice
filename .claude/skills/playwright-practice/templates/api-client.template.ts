// Copy to tests/suites/<Suite>/api/<Name>Api.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../../../core/api/BaseApi';
import { ILogger } from '../../../core/Logger';
import { exampleConfig } from '../config/ExampleConfig';

export class ExampleApi extends BaseApi {
  constructor(request: APIRequestContext, logger: ILogger) {
    super(request, logger, exampleConfig.apiBaseUrl);
  }

  async login(email: string, password: string): Promise<APIResponse> {
    this.logger.step(`API login for ${email}`);
    return this.post('/auth/login', { userEmail: email, userPassword: password });
  }

  async getToken(email: string, password: string): Promise<string> {
    const response = await this.login(email, password);
    if (!response.ok()) {
      throw new Error(`Login failed: HTTP ${response.status()}`);
    }
    const { token } = await response.json();
    return token;
  }
}
