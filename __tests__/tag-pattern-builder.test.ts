import {TagPatternBuilder} from "../src/tag-pattern-builder";

describe('TagPatternBuilder', () => {
    const unitUnderTest = new TagPatternBuilder()

    test('without prefix', () => {
        // given
        const packageName = ""

        // when
        const actual = unitUnderTest.build(packageName)

        // then
        expect(actual).toBe("v${version}");
    })

    test('with prefix', () => {
        // given
        const packageName = "doc"

        // when
        const actual = unitUnderTest.build(packageName)

        // then
        expect(actual).toBe("doc-v${version}");
    })
})