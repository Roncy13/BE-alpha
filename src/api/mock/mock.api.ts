import { alphavantageApiKey } from "@utilities/envVars";
import Api from "../../utilities/axios/api";
import { IUsTradeOutput } from "./mock.interface";
import { AxiosResponse } from "axios";
import { MockDTO } from "./mock.dto";

export class AlphavantageApi extends Api {
    constructor() {
        super('https://www.alphavantage.co');
    }

    async getTickerUnitedStates({ function: fn, ...props }: MockDTO): Promise<AxiosResponse<IUsTradeOutput>> {
        const params = this.attachInitialParams({
            function: fn,
            ...props,
        });
        const result = await this.get('/query', params);

        return result;
    }

    private attachInitialParams(params: {} = {}) {
        const apiKeyParams = this.attachApiKey(params);
        
        return apiKeyParams;
    }

    private attachApiKey(params: {} = {}) {
        return Object.assign(params, { apikey: alphavantageApiKey })
    }
}