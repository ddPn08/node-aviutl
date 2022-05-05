import { parseExFile, stringifyExFile } from '@aviutil/ex'

describe('#parseExFile', () => {
    test('should parse a toml file', () => {
        const normal = `[exedit]
width=1920
height=1080
[0]
start=1
[0.0]
_name=Text`
        const parsed = parseExFile(normal)
        expect(parsed['exedit']['width']).toBe(1920)
        expect(parsed['exedit']['height']).toBe(1080)
        expect(parsed['0']['start']).toBe(1)
        expect(parsed['0.0']['_name']).toBe('Text')
    })

    test('should parse a toml file with full width characters', () => {
        const normal = `[exedit]
width=1920
height=1080
[0]
start=1
[0.0]
_name=テキスト`
        const parsed = parseExFile(normal)
        expect(parsed['exedit']['width']).toBe(1920)
        expect(parsed['exedit']['height']).toBe(1080)
        expect(parsed['0']['start']).toBe(1)
        expect(parsed['0.0']['_name']).toBe('テキスト')
    })
})
describe('#stringifyExFile', () => {
    test('should stringify a toml file', () => {
        const normal = `[exedit]
width=1920
height=1080
[0]
start=1
[0.0]
_name=テキスト`
        const parsed = parseExFile(normal)
        const stringified = stringifyExFile(parsed)
        expect(stringified).toBe(normal)
    })
})
