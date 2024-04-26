import {DevVersionGenerator} from "./dev-version-generator";
import {TimestampGeneratorMock} from "./timestamp-generator.mock";

describe('DevVersionPostfixGenerator', () => {
  const timestampGeneratorMock = new TimestampGeneratorMock()
  const unitUnderTest = new DevVersionGenerator(timestampGeneratorMock)

  const branchName = "feat/mono-repo"

  test('generate generic', () => {
    // given
    const schema = ""

    // when
    const actual = unitUnderTest.generatePostfix(branchName, schema)

    // then
    expect(actual).toBe("-feat-mono-repo");
  })

  test('generate npm', () => {
    // given
    const schema = ""

    // when
    const actual = unitUnderTest.generatePostfix(branchName, schema)

    // then
    expect(actual).toBe("-feat-mono-repo");
  })

  test('generate python', () => {
    // given
    const schema = "python"

    // when
    const actual = unitUnderTest.generatePostfix(branchName, schema)

    // then
    expect(actual).toBe("dev20240426152947");
  })
})