export enum HTTP_METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete"
}

export const inBody: any = { in: ["body"] };
export const inParam: any = { in: ["params"] };
export const inQuery: any = { in: ["query"] };

export enum VARCHAR_STR {
  MAX_LENGTH = 255,
  MIN_LENGTH = 10,
};

export const saltRounds = 10;
export const SECRET_KEY = 'SAMPLE_SECRET_KEY';
export const TIME_INTRA_DAY = ['TIME_SERIES_INTRADAY',]
export const TIME_SERIES = [
  'TIME_SERIES_DAILY',
  'TIME_SERIES_DAILY_ADJUSTED',
  'TIME_SERIES_WEEKLY',
  'TIME_SERIES_WEEKLY_ADJUSTED',
  'TIME_SERIES_MONTHLY',
  'TIME_SERIES_MONTHLY_ADJUSTED'
];

export const INTERVAL = [
  '1min',
  '5min',
  '15min',
  '30min',
  '60min'
];

export const OUTPUT_SIZE = [
  'compact',
  'full'
];