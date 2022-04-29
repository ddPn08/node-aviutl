import * as EXO from '@aviutil/exo'

describe('exo from object', () => {
    const exo = EXO.create({
        object: {
            _name: 'テキスト',
        },
    })
    test('check string exo', () => {
        const str = exo.toString()
        const lines = str.split('\n')
        expect(lines[0]).toBe('[exedit]')
        expect(lines[8]).toBe('[0]')
        expect(lines[14]).toBe('[0.0]')
        expect(lines[16]).toBe('[0.1]')
    })
    test('check object keys method', () => {
        expect(exo.keys()).toBeInstanceOf(Array)
        expect(exo.keys()).toHaveLength(4)
        expect(exo.keys()).toContain('exedit')
        expect(exo.keys()).toContain('0')
        expect(exo.keys()).toContain('0.0')
        expect(exo.keys()).toContain('0.1')
    })
    test('check add item method', () => {
        exo.addItem({
            _name: 'アニメーション効果',
        })
        expect(exo['0.1']['_name']).toBe('アニメーション効果')
    })
    test('check delete item method', () => {
        exo.deleteItem('0.1')
        expect(exo['0.1']['_name']).toBe('標準描画')
    })
})

describe('exo from string', () => {
    const str = `[exedit]
width=1920
height=1080
[0]
start=1
[0.0]
_name=テキスト
[0.1]
_name=標準描画`
    const exo = EXO.fromString(str)
    test('check string exo', () => {
        expect(exo.toString()).toBe(str)
    })
    test('check object keys method', () => {
        expect(exo.keys()).toBeInstanceOf(Array)
        expect(exo.keys()).toHaveLength(4)
        expect(exo.keys()).toContain('exedit')
        expect(exo.keys()).toContain('0')
        expect(exo.keys()).toContain('0.0')
        expect(exo.keys()).toContain('0.1')
    })
})

describe('exo extra items', () => {
    const exo = EXO.create({
        object: {
            _name: 'テキスト',
        },
        extras: {
            '0.1': {
                _name: 'アニメーション効果',
            },
        },
    })
    test('check keys method', () => {
        expect(exo.keys()).toBeInstanceOf(Array)
        expect(exo.keys()).toHaveLength(5)
        expect(exo.keys()).toContain('exedit')
        expect(exo.keys()).toContain('0')
        expect(exo.keys()).toContain('0.0')
        expect(exo.keys()).toContain('0.1')
        expect(exo.keys()).toContain('0.2')
    })
    test('check extra item', () => {
        expect(exo['0.1']['_name']).toBe('アニメーション効果')
    })
})
