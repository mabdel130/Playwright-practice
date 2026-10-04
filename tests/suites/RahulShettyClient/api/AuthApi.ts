import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../../../core/api/BaseApi';
import { ILogger } from '../../../core/Logger';
import { clientConfig } from '../config/ClientConfig';

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext, logger: ILogger) {
    super(request, logger, clientConfig.apiBaseUrl);
  }

  async login(email: string, password: string): Promise<APIResponse> {
    this.logger.step(`API login with email: ${email}`);
    return this.post('/auth/login', { userEmail: email, userPassword: password });
  }

  async getToken(email: string, password: string): Promise<string> {
    const response = await this.login(email, password);
    if (!response.ok()) {
      throw new Error(`API login failed for ${email}: HTTP ${response.status()} ${await response.text()}`);
    }
    const { token } = await response.json();
    return token;
  }
}
