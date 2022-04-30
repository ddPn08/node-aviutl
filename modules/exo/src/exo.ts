import type { Exedit, ExoType, ExoObject, ObjectFooter, ObjectHeader, ObjectItemType } from './types'
namespace EXO {
    export const parse = <T extends ObjectItemType = ObjectItemType>(str: string): ExoType<T> => {
        const base: Record<string, any> = {}

        const lines = str.split(/\r\n|\n|\r/)
        let curKey: string | undefined
        for (const line of lines) {
            const keyMatch = line.match(/^\[(.*)\]$/)
            const valueMatch = line.match(/^(.*)=(.*)$/)
            if (keyMatch) {
                const key = keyMatch[1]!
                curKey = key
                base[key] = {}
            } else if (valueMatch) {
                if (!curKey) throw new Error('curKey is not defined')
                const key = valueMatch[1]!
                const value = valueMatch[2]!
                if (!key) throw new Error('key is empty')
                base[curKey]![key] = value
            }
        }

        const { exedit, '0': header, '0.0': item, ...rest } = base
        const last = Object.keys(rest).pop() as string
        const { [last]: footer, ...extras } = rest

        return create({
            exedit,
            header,
            item,
            extras,
            footer,
        })
    }

    export const create = <T extends ObjectItemType>(context: {
        item: T
        extras?: Record<string, any>
        exedit?: Exedit
        header?: ObjectHeader
        footer?: ObjectFooter
    }): ExoType<T> => {
        context.exedit = context.exedit || {
            width: 1902,
            height: 1080,
            rate: 60,
            scale: 1,
            length: 2001,
            audio_rate: 44100,
            audio_ch: 2,
        }
        context.header = context.header || {
            start: 1,
            end: 1001,
            layer: 1,
            overlay: 1,
            camera: 0,
        }
        context.footer = context.footer || {
            _name: '標準描画',
            X: 0,
            Y: 0,
            Z: 0,
            拡大率: 100,
            透明度: 0,
            回転: 0,
            blend: 0,
        }

        const obj: ExoObject<T> = {
            exedit: context.exedit,
            '0': context.header,
            '0.0': context.item,
        }
        if (context.extras) for (const key in context.extras) obj[key as keyof ExoObject<T>] = context.extras[key]

        obj[`0.${Object.keys(obj).length - 2}`] = context.footer

        return {
            keys(): string[] {
                return Object.keys(this)
                    .filter((v) => typeof this[v as keyof typeof this] !== 'function')
                    .sort((a, b) => {
                        if (a === 'exedit') return -1
                        if (b === 'exedit') return 1
                        return Number(a) - Number(b)
                    })
            },
            toString() {
                let contents = ''
                for (const key of this.keys()) {
                    const typedKey = key as keyof typeof this
                    if (contents !== '') contents += '\r\n'
                    contents += `[${key}]`
                    for (const subkey in this[typedKey]) {
                        contents += `\r\n${subkey}=${this[typedKey][subkey]}`
                    }
                }
                return contents
            },
            addItem(item: ObjectItemType) {
                const footer = obj[`0.${Object.keys(obj).length - 3}`]
                this[`0.${Object.keys(obj).length - 3}`] = item
                this[`0.${Object.keys(obj).length - 2}`] = footer
            },
            deleteItem(key: `0.${number}`) {
                if (!this.keys().includes(key)) throw new Error(`${key} is not found`)
                const index = key.replace(/^0\./, '')
                delete this[key]
                const behind = this.keys().filter((k) => k.replace(/^0\./, '') > index)
                delete behind[0]
                behind.forEach((k) => {
                    const typedKey = k as keyof typeof this
                    const item = this[typedKey]
                    this[`0.${Number(k.replace(/^0\./, '')) - 1}`] = item
                    delete this[typedKey]
                })
            },
            toJson() {
                const cloned: Record<string, any> = {}
                for (const key of this.keys()) {
                    const typedKey = key as keyof typeof this
                    cloned[typedKey] = this[typedKey]
                }
                return cloned as ExoObject<T>
            },
            ...obj,
        }
    }

    export const createFromJson = <T extends ObjectItemType>(json: ExoObject<T>): ExoType<T> => {
        const { exedit, '0': header, '0.0': item, ...rest } = json as Record<string, any>
        const last = Object.keys(rest).pop() as string
        const { [last]: footer, ...extras } = rest

        return create({
            exedit,
            header,
            item,
            extras,
            footer,
        })
    }
}

export default EXO
