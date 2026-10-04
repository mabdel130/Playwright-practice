import { APIRequestContext, APIResponse } from '@playwright/test';
import { ILogger } from '../Logger';

export abstract class BaseApi {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly logger: ILogger,
    protected readonly baseUrl: string,
  ) {}

  protected async post(endpoint: string, data: unknown): Promise<APIResponse> {
    this.logger.step(`POST ${endpoint}`);
    return this.request.post(`${this.baseUrl}${endpoint}`, { data });
  }
}
