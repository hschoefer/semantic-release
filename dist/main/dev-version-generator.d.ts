import { TimestampGenerator } from "./timestamp-generator";
export declare class DevVersionGenerator {
    private timestampGenerator;
    constructor(timestampGenerator: TimestampGenerator);
    generatePostfix(branchName: string, schema: string): string;
    generateConnector(schema: string): string;
}
