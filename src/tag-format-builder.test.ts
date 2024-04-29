import {TagFormatBuilder} from "./tag-format-builder";

describe('TagFormatBuilder', () => {
    const unitUnderTest = new TagFormatBuilder()

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