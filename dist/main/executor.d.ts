import { ExecOptions } from '@actions/exec';
export declare class Executor {
    cat(): Promise<ExecResult>;
    lsActionDirectory(): Promise<ExecResult>;
    gitBranch(): Promise<string>;
    prepareSemanticReleaseWorkingDirectory(workingDirectory: string): Promise<void>;
    npmInstall(workingDirectory: string): Promise<void>;
    pwd(): Promise<ExecResult>;
    private buildActionDirectoryPath;
    ls(path: string): Promise<ExecResult>;
    private buildSemanticReleasePath;
    exec(tool: string, args: string[], options?: ExecOptions): Promise<ExecResult>;
    executeSemanticRelease(workingDirectory: string, debug: boolean, assets: string, tagFormat: string, branchName: string, branchNameProcessed: string, versionConnector: string, dryRun: boolean): Promise<void>;
    executeDryRun(workingDirectory: string, debug: boolean, assets: string, tagFormat: string, branchName: string, branchNameProcessed: string, versionConnector: string): Promise<void>;
    executeRelease(workingDirectory: string, debug: boolean, assets: string, tagFormat: string, branchName: string, branchNameProcessed: string, versionConnector: string): Promise<void>;
    writeOutputs(workingDirectory: string, defaultBranch: string, branchName: string): Promise<void>;
}
export interface ExecResult {
    stdout: string;
    exitCode: number;
}
