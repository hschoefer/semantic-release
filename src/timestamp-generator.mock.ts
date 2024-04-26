import {TimestampGenerator} from "./timestamp-generator";

export class TimestampGeneratorMock implements TimestampGenerator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generate(pattern?: string): string {
    return "20240426152947";
  }
}