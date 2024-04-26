import {DevVersionGenerator} from "./dev-version-generator";
import {TimestampGeneratorMock} from "./timestamp-generator.mock";

describe('DevVersionPostfixGenerator', () => {
  const timestampGeneratorMock = new TimestampGeneratorMock()
  const unitUnderTest = new DevVersionGenerator(timestampGeneratorMock)

  const branchName = "feat/mono-repo"

  describe("generatePostfix", () => {
    test('for unset', () => {
      // given
      const schema = ""

      // when
      const actual = unitUnderTest.generatePostfix(branchName, schema)

      // then
      expect(actual).toBe("-feat-mono-repo");
    })

    test('for generic', () => {
      // given
      const schema = "generic"

      // when
      const actual = unitUnderTest.generatePostfix(branchName, schema)

      // then
      expect(actual).toBe("-feat-mono-repo");
    })

    test('for npm', () => {
      // given
      const schema = "npm"

      // when
      const actual = unitUnderTest.generatePostfix(branchName, schema)

      // then
      expect(actual).toBe("-feat-mono-repo");
    })

    test('for python', () => {
      // given
      const schema = "python"

      // when
      const actual = unitUnderTest.generatePostfix(branchName, schema)

      // then
      expect(actual).toBe("dev20240426152947");
    })
  })

  describe("generateConnector", () => {
    test('for unset', () => {
      // given
      const schema = ""

      // when
      const actual = unitUnderTest.generateConnector(schema)

      // then
      expect(actual).toBe("+");
    })

    test('for generic', () => {
      // given
      const schema = "generic"

      // when
      const actual = unitUnderTest.generateConnector(schema)

      // then
      expect(actual).toBe("+");
    })

    test('for npm', () => {
      // given
      const schema = "npm"

      // when
      const actual = unitUnderTest.generateConnector(schema)

      // then
      expect(actual).toBe("-");
    })

    test('for python', () => {
      // given
      const schema = "python"

      // when
      const actual = unitUnderTest.generateConnector(schema)

      // then
      expect(actual).toBe(".");
    })
  })
})