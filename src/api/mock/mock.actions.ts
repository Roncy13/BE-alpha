import SmurfResponse, { SmurfAction } from "@core/response";
import { GetUsTradedSrv } from "./mock.services";
import { BaseMockSchema, MockSchema } from "./mock.validators";
import { HTTP_METHODS } from "@utilities/constants";
import { Request } from "express";
import { MockDTO } from "./mock.dto";

@SmurfAction({
  action: '/mock',
  message: 'Mock fetched successfully',
  validation: MockSchema,
  method: HTTP_METHODS.POST
})
export class MockIntradayApi extends SmurfResponse {

  async run(req: Request) {
    const payload = req.body as MockDTO;

    this.result = await GetUsTradedSrv(payload);
  }
}

@SmurfAction({
  action: '/mock/trading',
  message: 'Mock fetched successfully',
  validation: BaseMockSchema,
  method: HTTP_METHODS.POST
})
export class MockTradeApi extends SmurfResponse {

  async run(req: Request) {
    const payload = req.body as MockDTO;

    this.result = await GetUsTradedSrv(payload);
  }
}