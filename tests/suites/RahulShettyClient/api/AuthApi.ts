import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../../../core/api/BaseApi';
import { ILogger } from '../../../core/Logger';
import { clientConfig } from '../config/ClientConfig';
import { UserData } from '../data/TestData';

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext, logger: ILogger) {
    super(request, logger, clientConfig.apiBaseUrl);
  }

  async login(email: string, password: string): Promise<APIResponse> {
    this.logger.step(`API login with email: ${email}`);
    return this.post('/auth/login', { userEmail: email, userPassword: password });
  }

  async register(user: UserData): Promise<void> {
    this.logger.step(`API register user: ${user.email}`);
    const response = await this.post('/auth/register', {
      firstName: user.firstName,
      lastName: user.lastName,
      userEmail: user.email,
      userRole: 'customer',
      // The UI option value is "3: Engineer"; the API expects just "Engineer".
      occupation: user.occupation.replace(/^\d+:\s*/, ''),
      gender: user.gender,
      userMobile: user.phone,
      userPassword: user.password,
      confirmPassword: user.password,
      required: true,
    });
    if (!response.ok()) {
      throw new Error(`API register failed for ${user.email}: HTTP ${response.status()} ${await response.text()}`);
    }
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
