import type { ItemObject, Exedit, ItemFooter, ItemHeader, BaseItem } from './types.js'

export class EXO {
    public static create(c: { exedit?: Exedit; items: BaseItem[] }) {
        const object: Record<string, any> = {}
        object['exedit'] = c.exedit || {}

        for (const item of c.items) for (const key in item) object[key] = item[key as keyof BaseItem]

        return new EXO(object)
    }

    private static parseFromString(str: string) {
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
                const value = Number(valueMatch[2]!) || valueMatch[2]!
                if (!key) throw new Error('key is empty')
                base[curKey]![key] = value
            }
        }

        return new EXO(base)
    }

    private static parseFromJson(json: Record<string, any>) {
        return new EXO(json)
    }

    public static parse(str: string | Record<string, any>) {
        if (typeof str === 'string') {
            try {
                return EXO.parseFromJson(JSON.parse(str))
            } catch (_) {
                return EXO.parseFromString(str)
            }
        }
        return EXO.parseFromJson(str)
    }

    public readonly exedit: Exedit
    public readonly items: BaseItem[] = []

    private constructor(object: Record<string, any>) {
        const keys = Object.keys(object).sort((a, b) => {
            if (a === 'exedit') return -1
            if (b === 'exedit') return 1
            return Number(a) - Number(b)
        })

        if (!keys.includes('exedit')) throw new Error('exedit is not found')
        this.exedit = object['exedit']

        for (const key of keys) {
            if (key === 'exedit') continue
            if (key.match(/\d/) && key.length === 1) {
                const item = object[key]
                this.items.push({
                    [key]: item,
                })
                continue
            }
            const match = key.match(/(\d)\.(\d)/)
            if (!match) continue
            const index = Number(match[1])
            const subIndex = Number(match[2])
            const item = this.items.find((i) => i[`${index}`])
            if (!item) throw new Error(`${key} is not found`)
            item[`${index}.${subIndex}`] = object[key]
        }
    }

    public toJSON() {
        const items: Record<string, Exedit | ItemObject | ItemHeader | ItemFooter> = {
            exedit: this.exedit,
        }
        for (const item of this.items) {
            for (const key in item) {
                if (key.match(/\d/) && key.length === 1) {
                    items[key] = item[`${Number(key)}`] as ItemHeader
                } else if (key.match(/(\d)\.(\d)/)) {
                    const match = key.match(/(\d)\.(\d)/)!
                    items[key] = item[`${Number(match[1])}.${Number(match[2])}`] as ItemObject | ItemFooter
                }
            }
        }
        const object: Record<string, any> = {}
        for (const key of Object.keys(items)) object[key] = items[key]
        return object
    }

    public toString() {
        const json = this.toJSON()
        const keys = Object.keys(json).sort((a, b) => {
            if (a === 'exedit') return -1
            if (b === 'exedit') return 1
            return Number(a) - Number(b)
        })
        const lines: string[] = []
        for (const key of keys) {
            lines.push(`[${key}]`)
            for (const key2 in json[key]) {
                const item = json[key]!
                lines.push(`${key2}=${item![key2 as keyof typeof item]}`)
            }
        }
        return lines.join('\r\n')
    }

    public pushItem(c: { header: ItemHeader; objects: ItemObject[]; footer: ItemFooter }) {
        const index = this.items.length
        const item: BaseItem = {
            [`${index}`]: c.header,
        }
        for (const object of c.objects) {
            const sub = Object.keys(item).length - 1
            item[`${index}.${sub}`] = object
        }
        item[`${index}.${Object.keys(item).length - 1}`] = c.footer
        this.items.push(item)
    }

    public deleteItem(index: number) {
        const toRemove = this.items.find((i) => i[`${index}`])
        if (!toRemove) throw new Error(`${index} is not found`)
        this.items.splice(index, 1)

        const toFix = Object.keys(this.items).filter((v) => Number(v) > index)

        for (const key of toFix) {
            const item = this.items[Number(key)]
            for (const key2 in item) {
                const typed = key2 as keyof typeof item
                const replaced = typed.replace(/\d+/, (v) => `${Number(v) - 1}`)
                delete Object.assign(item, {
                    [replaced]: item[typed],
                })[key2]
            }
        }
    }
}

export const isItem = (v: any): v is BaseItem => {
    return Object.keys(v).some((k) => k.match(/\d/)) && Object.keys(v).some((k) => k.match(/(\d)\.(\d)/))
}
