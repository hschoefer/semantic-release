import * as core from '@actions/core'
import {Executor} from "./executor";

async function run(): Promise<void> {
  const workingDirectory: string = core.getInput('working-directory')
  const assets: string = core.getInput('assets')
  const debugFlag: boolean = core.getInput('debug') === "true"
  const step: string = core.getInput('step')
  const defaultBranch: string = core.getInput('default-branch')
  const developmentVersionSchema: string = core.getInput('dev-version-schema')

  const executor = new Executor()
  try {
    const branchName = await executor.gitBranch()
    const branchNameProcessed = await executor.gitBranchFormatted(developmentVersionSchema)

    await executor.prepareSemanticReleaseWorkingDirectory(workingDirectory)
    await executor.npmInstall(workingDirectory)

    const versionConnector = await executor.buildVersionConnector(developmentVersionSchema)

    if ('prepare' == step) {
      core.info("Execute prepare step.")
      await executor.executeDryRun(workingDirectory, debugFlag, assets, branchName, branchNameProcessed, versionConnector)
      await executor.writeOutputs(workingDirectory, defaultBranch, branchName)
    } else {
      await executor.executeRelease(workingDirectory, debugFlag, assets, branchName, branchNameProcessed, versionConnector)
    }

  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()