import { INTERVAL, OUTPUT_SIZE, TIME_INTRA_DAY, TIME_SERIES, inBody } from '@utilities/constants';
import { Request } from 'express';
import { Schema }  from 'express-validator';

const monthRegex = new RegExp('\d{4}-\d{2}', 'gm')
/**
 * Change the [sampleFieldName] to the property you are using.
 * Change the Field Name to the name of the property you are using.
 * In Body just tells that the schema be used in the Body section of the request.
 */

export const BaseMockSchema: Schema = {
  symbol: {
    ...inBody,
    isEmpty: true,
    default: {
      options: 'IBM'
    }
  },
  function: {
    ...inBody,
    isEmpty: false,
    isIn: {
      options: [TIME_SERIES]
    }
  },
  outputsize: {
    ...inBody,
    optional: true,
    default: {
      options: OUTPUT_SIZE[0]
    },
    isIn: {
      options: OUTPUT_SIZE
    }
  }
}

export const MockSchema: Schema = {
  ...BaseMockSchema,
  function: {
    ...inBody,
    isEmpty: false,
    isIn: {
      options: [TIME_INTRA_DAY]
    }
  },
  interval: {
    ...inBody,
    optional: true,
    isIn: {
      options: [INTERVAL]
    }
  },
  adjusted: {
    ...inBody,
    optional: true,
    isBoolean: true,
    default: {
      options: true
    }
  },
  extended_hours: {
    ...inBody,
    optional: true,
    isBoolean: true,
    default: {
      options: true
    }
  },
  month: {
    ...inBody,
    optional: true,
    custom: {
      options: (request: Request) => {
        const month = request.body.month;
        if (month) {
          try {
            const result = monthRegex.test(month);

            if (!result) {
              throw new Error('Not valid month');
            }
          } catch(err) {
            return Promise.reject(err);
          }
        }

        return month;
      }
    }
  },
};