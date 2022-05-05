export const parseExFile = (str: string): Record<string, any> => {
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
    return base
}

export const stringifyExFile = (obj: Record<string, any>) => {
    const keys = Object.keys(obj).sort((a, b) => {
        if (a === 'exedit') return -1
        if (b === 'exedit') return 1
        return Number(a) - Number(b)
    })
    const lines: string[] = []
    for (const key of keys) {
        lines.push(`[${key}]`)
        for (const key2 in obj[key]) {
            const item = obj[key]!
            lines.push(`${key2}=${item![key2 as keyof typeof item]}`)
        }
    }
    return lines.join('\n')
}
