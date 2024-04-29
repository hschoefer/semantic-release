import * as core from '@actions/core'
import {Executor} from "./executor";
import {TagPatternBuilder} from "./tag-pattern-builder";
import {DevVersionGenerator} from "./dev-version-generator";
import {DayjsTimestampGenerator} from "./dayjs-timestamp-generator";

const timestampGenerator = new DayjsTimestampGenerator()
const devVersionGenerator = new DevVersionGenerator(
  timestampGenerator,
)

async function run(): Promise<void> {
  const assets: string = core.getInput('assets')
  const debugFlag: boolean = core.getInput('debug') === "true"
  const defaultBranch: string = core.getInput('default-branch')
  const developmentVersionSchema: string = core.getInput('dev-version-schema')
  const packageName: string = core.getInput('package-name')
  const step: string = core.getInput('step')
  const workingDirectory: string = core.getInput('working-directory')

  const executor = new Executor()
  try {
    const branchName = await executor.gitBranch()

    const branchNameProcessed = devVersionGenerator.generatePostfix(branchName, developmentVersionSchema)
    const versionConnector = await devVersionGenerator.generateConnector(developmentVersionSchema)

    await executor.prepareSemanticReleaseWorkingDirectory(workingDirectory)
    await executor.npmInstall(workingDirectory)

    core.info(`Using package name: ${packageName}`)

    const tagPattern = new TagPatternBuilder().build(packageName)
    core.info(`Using tag pattern: ${tagPattern}`)

    if ('prepare' == step) {
      core.info("Execute prepare step.")
      await executor.executeDryRun(workingDirectory, debugFlag, assets, tagPattern, branchName, branchNameProcessed, versionConnector)
      await executor.writeOutputs(workingDirectory, defaultBranch, branchName)
    } else {
      await executor.executeRelease(workingDirectory, debugFlag, assets, tagPattern, branchName, branchNameProcessed, versionConnector)
    }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()