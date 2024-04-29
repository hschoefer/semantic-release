export class TagFormatBuilder {
  build(packageName: string): string {
    let prefix = ""
    if ("" != packageName) {
      prefix = `${packageName}-`
    }

    return `${prefix}v\${version}`
  }
}