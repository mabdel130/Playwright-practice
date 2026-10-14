import { APIRequestContext, APIResponse } from '@playwright/test';
import { ILogger } from '../Logger';
import { recordApiResponse } from '../debug';

export abstract class BaseApi {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly logger: ILogger,
    protected readonly baseUrl: string,
  ) {}

  protected async post(endpoint: string, data: unknown): Promise<APIResponse> {
    this.logger.step(`POST ${endpoint}`);
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.request.post(url, { data });
    await recordApiResponse(this.logger, 'POST', url, response);
    return response;
  }
}
