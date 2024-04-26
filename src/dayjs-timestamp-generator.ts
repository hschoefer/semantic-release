import {TimestampGenerator} from "./timestamp-generator";
import dayjs from "dayjs";

export class DayjsTimestampGenerator implements TimestampGenerator {
  generate(pattern?: string): string {
    if (undefined == pattern) {
      return `${dayjs().format()}`
    }

    return `${dayjs().format(pattern)}`
  }
}