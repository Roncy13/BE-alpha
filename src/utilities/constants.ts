export enum HTTP_METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete"
}

export const inBody: any = { in: ["body"] };
export enum VARCHAR_STR {
  MAX_LENGTH = 255,
  MIN_LENGTH = 10,
};

export const saltRounds = 10;
export const SECRET_KEY = 'SAMPLE_SECRET_KEY_DIGITAL_ARCHIVE';