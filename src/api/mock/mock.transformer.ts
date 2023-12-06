import { MockDTO } from "./mock.dto";
const payloadKeys = [
    'function',
    'symbol',
    'interval',
    'adjusted',
    'extended_hours',
    'month',
    'outputsize'
]
export const mockParamsTransformer = (payload: MockDTO) => {
    const result: Partial<MockDTO> = {};
    const keys = Object.keys(payload)

    payloadKeys.forEach(r => {
        if (keys.includes(r)) {
            const value = {...payload}[r]
            Object.assign(result, { [r]: value })
        }
    })

    return result as MockDTO;
}