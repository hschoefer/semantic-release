import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {ExecOptions} from '@actions/exec'
import * as io from '@actions/io'
import path from "node:path";
import fs from 'fs';
import dayjs from "dayjs";

export class Executor {
    async cat() {
        const path2 = path.join(`${this.buildActionDirectoryPath()}/package.json`)

        return this.exec("cat", [path2])
    }

    async lsActionDirectory() {
        return this.exec("ls", ["-la", this.buildActionDirectoryPath()])
    }

    async buildVersionConnector(versionScheme: string) {
        let versionConnector = "+"
        if ("python" == versionScheme) {
            versionConnector = "."
        }
        if ("npm" == versionScheme) {
            versionConnector = "-"
        }

        return versionConnector
    }

    async gitBranch() {
        const branchNameCommandResult = await this.exec('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
        core.debug(`Branch name: ${branchNameCommandResult}`)
        return branchNameCommandResult.stdout.trim()
    }

    async gitBranchFormatted(versionScheme: string) {
        const branchName = await this.gitBranch()

        let versionReplaced = branchName
          .replace(/[/_@]/g, '.')
        if ("python" == versionScheme) {
            versionReplaced = `${dayjs().format('YYYYMMDDHHmmss')}`
        }

        const formattedShortened = versionReplaced.substring(0, 40);
        core.debug(`Formatted branch name: ${formattedShortened}`)

        let prefix = "+"
        if ("python" == versionScheme) {
            prefix = "dev"
        }
        return `${prefix}${formattedShortened}`
    }

    async prepareSemanticReleaseWorkingDirectory(workingDirectory: string) {
        io.mkdirP(workingDirectory)

        const sourceDirectory = path.join(this.buildSemanticReleasePath())
        const targetDirectory = path.join(workingDirectory);

        await io.cp(sourceDirectory, targetDirectory, {recursive: true, force: true, copySourceDirectory: false});
    }

    async npmInstall(workingDirectory: string) {
        await this.exec("npm", ["install"], {cwd: workingDirectory});
    }

    async pwd() {
        return this.exec("pwd", [])
    }

    private buildActionDirectoryPath(): string {
        const actionDirectoryName = __dirname.replace("/dist/main", "")
        return path.join(actionDirectoryName)
    }

    async ls(path: string) {
        return this.exec("ls", ["-la", path])
    }

    private buildSemanticReleasePath(): string {
        return path.join(this.buildActionDirectoryPath(), 'semantic-release');
    }

    async exec(tool: string,
               args: string[],
               options?: ExecOptions): Promise<ExecResult> {
        const result: ExecResult = {
            stdout: "",
            exitCode: 0,
        }

        const stdout: string[] = []

        const defaultOptions: ExecOptions = {
            listeners: {
                stdout: (data: Buffer) => {
                    stdout.push(data.toString())
                }
            }
        }
        const mergedOptions: ExecOptions = Object.assign(defaultOptions, options)

        try {
            result.exitCode = await exec.exec(tool, args, mergedOptions)
        } catch (error) {
            console.error(`Execution failed: ${error}`);
            throw error;
        }
        result.stdout = stdout.join('')

        return result
    }

    async executeSemanticRelease(workingDirectory: string, debug: boolean, assets: string, tagPattern: string, branchName: string, branchNameProcessed: string, versionConnector: string, dryRun: boolean) {
        const config = path.join(workingDirectory, 'release.config.js');

        let parameters = [path.join(workingDirectory, "/node_modules/.bin/semantic-release"), "--extends", config]
        parameters = debug ? [...parameters, "--debug"] : parameters;
        parameters = dryRun ? [...parameters, "--dry-run"] : parameters;

        const options = {
            env: {
                ...process.env,
                ASSETS: assets,
                WORKING_DIRECTORY: workingDirectory,
                TAG_PATTERN: tagPattern,
                BRANCH_NAME_PLAIN: branchName,
                BRANCH_NAME_PROCESSED: branchNameProcessed,
                VERSION_CONNECTOR: versionConnector,
            }
        };
        await this.exec("npx", parameters, options);
    }

    async executeDryRun(workingDirectory: string, debug: boolean, assets: string, tagPattern: string, branchName: string, branchNameProcessed: string, versionConnector: string) {
        await this.executeSemanticRelease(workingDirectory, debug, assets, tagPattern, branchName, branchNameProcessed, versionConnector, true);
    }

    async executeRelease(workingDirectory: string, debug: boolean, assets: string, tagPattern: string, branchName: string, branchNameProcessed: string, versionConnector: string) {
        await this.executeSemanticRelease(workingDirectory, debug, assets, tagPattern, branchName, branchNameProcessed, versionConnector, false);
    }

    async writeOutputs(workingDirectory: string, defaultBranch: string, branchName: string) {
        const versionTxt = path.join(workingDirectory, '/version.txt')
        if (fs.existsSync(versionTxt)) {
            const version = fs.readFileSync(versionTxt, 'utf8').trim()

            core.setOutput("release-version", version)
            core.setOutput("release-version-file", versionTxt)

            if (defaultBranch == branchName) {
                core.setOutput("version", version)
                core.setOutput("version-file", versionTxt)
            }
        }

        const versionDevTxt = path.join(workingDirectory, '/dev-version.txt')
        if (fs.existsSync(versionDevTxt)) {
            const versionDev = fs.readFileSync(versionDevTxt, 'utf8').trim()

            core.setOutput("dev-version", versionDev)
            core.setOutput("dev-version-file", versionDevTxt)

            if (defaultBranch != branchName) {
                core.setOutput("version", versionDev)
                core.setOutput("version-file", versionDevTxt)
            }
        }
    }

}

export interface ExecResult {
    stdout: string
    exitCode: number
}