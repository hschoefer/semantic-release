import * as core from "@actions/core";
import {TimestampGenerator} from "./timestamp-generator";

export class DevVersionGenerator {

  constructor(private timestampGenerator: TimestampGenerator) {
  }

  generatePostfix(branchName: string, schema: string): string {
    let versionReplaced = branchName
      .replace(/[/_@]/g, '-')
    if ("python" == schema) {
      versionReplaced = `${this.timestampGenerator.generate('YYYYMMDDHHmmss')}`
    }

    const formattedShortened = versionReplaced.substring(0, 40);
    core.debug(`Formatted branch name: ${formattedShortened}`)

    let prefix = "-"
    if ("python" == schema) {
      prefix = "dev"
    }
    return `${prefix}${formattedShortened}`
  }

  generateConnector(schema: string): string {
    return schema
  }
}