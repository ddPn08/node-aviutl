import { EXO } from '@aviutil/exo'

describe('EXO', () => {
    describe('#create', () => {
        const origin = {
            exedit: {
                width: 1920,
                height: 1080,
                rate: 60,
                scale: 1,
                length: 10,
                audio_rate: 44100,
                audio_ch: 2,
            },
            items: [
                {
                    '0': {
                        start: 1,
                        end: 2,
                        layer: 1,
                        overlay: 1,
                        camera: 1,
                    },
                    '0.0': {
                        _name: '画像',
                    },
                    '0.1': {
                        _name: '標準描画',
                        X: 0.0,
                        Y: 0.0,
                        Z: 0.0,
                        拡大率: 1.0,
                        透明度: 0,
                        回転: 0,
                        blend: 0,
                    },
                },
            ],
        }
        const exo = EXO.create(origin)

        describe('#toString', () => {
            const str = exo.toString()
            test('should have all the correct keys', () => {
                const lines = str.split('\r\n')
                expect(lines[0]).toBe('[exedit]')
                expect(lines[8]).toBe('[0]')
                expect(lines[14]).toBe('[0.0]')
                expect(lines[16]).toBe('[0.1]')
            })
            test('should have all the correct values', () => {
                const lines = str.split('\r\n')
                expect(lines[1]).toBe('width=1920')
                expect(lines[15]).toBe('_name=画像')
                expect(lines[17]).toBe('_name=標準描画')
            })
        })
        describe('#toJSON', () => {
            const json = exo.toJSON()
            test('should have all the correct keys', () => {
                const keys = Object.keys(json)
                expect(keys.length).toBe(4)
                expect(keys).toContain('exedit')
                expect(keys).toContain('0')
                expect(keys).toContain('0.0')
                expect(keys).toContain('0.1')
            })
            test('should have all the correct values', () => {
                expect(json['exedit']['width']).toBe(1920)
                expect(json['0.0']['_name']).toBe('画像')
                expect(json['0.1']['_name']).toBe('標準描画')
            })
        })
        describe('#pushItem, #deleteItem', () => {
            test('should be able to add items', () => {
                const c = {
                    header: {
                        start: 1,
                        end: 2,
                        layer: 1,
                        overlay: 1,
                        camera: 1,
                    },
                    objects: [
                        {
                            _name: '画像',
                        },
                    ],
                    footer: {
                        _name: '標準描画',
                        X: 0.0,
                        Y: 0.0,
                        Z: 0.0,
                        拡大率: 1.0,
                        透明度: 0,
                        回転: 0,
                        blend: 0,
                    },
                }
                exo.pushItem(c)
                expect(exo.items.length).toBe(2)
                expect(exo.items[1]).toBeDefined()
                expect(exo.items[1]!['1']).toEqual(c.header)
                expect(exo.items[1]!['1.0']).toEqual(c.objects[0])
                expect(exo.items[1]!['1.1']).toEqual(c.footer)
            })
            test('should be able to delete items', () => {
                exo.deleteItem(1)
                expect(exo.items.length).toBe(1)
                expect(exo.items[1]).toBeUndefined()
                exo.items.forEach((item, i) => {
                    const expectedKeys = Object.keys(item).map((_, i2) => {
                        if (i2 === 0) return `${i2}`
                        else return `${i}.${i2 - 1}`
                    })
                    expect(Object.keys(item)).toEqual(expectedKeys)
                })
            })
        })
    })
    describe('#parse (string)', () => {
        const origin = `[exedit]
width=1920
height=1080
[0]
start=1
[0.0]
_name=テキスト
[0.1]
_name=標準描画`.replace(/\n/g, '\r\n')
        const exo = EXO.parse(origin)
        test('should be equal to original string', () => {
            expect(exo.toString()).toBe(origin)
        })
        test('should have all the correct keys', () => {
            const json = exo.toJSON()
            console.log(json)
            const keys = Object.keys(json)
            expect(keys.length).toBe(4)
            expect(keys).toContain('exedit')
            expect(keys).toContain('0')
            expect(keys).toContain('0.0')
            expect(keys).toContain('0.1')
        })
        test('should have all the correct values', () => {
            expect(exo['exedit']['width']).toBe(1920)
            expect(exo['exedit']['height']).toBe(1080)
            expect(exo.items[0]!['0.0']!['_name']).toBe('テキスト')
            expect(exo.items[0]!['0.1']!['_name']).toBe('標準描画')
        })
    })

    describe('#parse (json object)', () => {
        const origin = {
            exedit: { width: 1920, height: 1080 },
            '0': { start: 1 },
            '0.0': { _name: 'テキスト' },
            '0.1': { _name: '標準描画' },
        }
        const exo = EXO.parse(origin)
        test('should be equal to original json', () => {
            expect(exo.toJSON()).toEqual(origin)
        })
        test('should have all the correct keys', () => {
            const json = exo.toJSON()
            const keys = Object.keys(json)
            expect(keys.length).toBe(4)
            expect(keys).toContain('exedit')
            expect(keys).toContain('0')
            expect(keys).toContain('0.0')
            expect(keys).toContain('0.1')
        })
        test('should have all the correct values', () => {
            expect(exo['exedit']['width']).toBe(1920)
            expect(exo['exedit']['height']).toBe(1080)
            expect(exo.items[0]!['0.0']!['_name']).toBe('テキスト')
            expect(exo.items[0]!['0.1']!['_name']).toBe('標準描画')
        })
    })

    describe('#parse (json string)', () => {
        const origin = '{"0":{"start":1},"exedit":{"width":1920,"height":1080},"0.0":{"_name":"テキスト"},"0.1":{"_name":"標準描画"}}'
        const exo = EXO.parse(origin)
        test('should be equal to original json', () => {
            expect(exo.toJSON()).toEqual(JSON.parse(origin))
        })
        test('should have all the correct keys', () => {
            const json = exo.toJSON()
            const keys = Object.keys(json)
            expect(keys.length).toBe(4)
            expect(keys).toContain('exedit')
            expect(keys).toContain('0')
            expect(keys).toContain('0.0')
            expect(keys).toContain('0.1')
        })
        test('should have all the correct values', () => {
            expect(exo['exedit']['width']).toBe(1920)
            expect(exo['exedit']['height']).toBe(1080)
            expect(exo.items[0]!['0.0']!['_name']).toBe('テキスト')
            expect(exo.items[0]!['0.1']!['_name']).toBe('標準描画')
        })
    })
})
