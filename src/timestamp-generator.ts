export interface TimestampGenerator {
  generate(pattern?: string): string
}