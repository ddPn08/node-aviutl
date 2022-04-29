import fs from 'fs'
import path from 'path'
import iconv from 'iconv-lite'
import './__setup.mjs'

const KNOWN_TYPE_TEMPLATE = `import type { ExoObject, BaseObjectItem } from '../index'

export type \${name}Object = ExoObject<\${name}ObjectItem>

export interface \${name}ObjectItem extends BaseObjectItem {
\${typeDef}
}
`
const KNOWN_TYPE_INDEX_LINE = `export * from './\${name}'`

const templates = path.join(__dirname, '..', 'templates')

const exos = await fs.promises.readdir(templates)

const tasks = exos.map((exo) => async () => {
    const contents = iconv.decode(await fs.promises.readFile(path.join(templates, exo)), 'shift_jis')
    const lines = contents.split('\r\n')

    let item = ''
    for (const line of lines) {
        if (line.includes('[0.1]')) break
        if (line.includes('[0.0]') || item !== '') item += line + '\n'
    }

    let typeDef = ''
    for (const line of item.split('\n')) {
        if (line.includes('=')) {
            const [key, value] = line.split('=')
            if (key === '_name') {
                typeDef += `    ${key}: '${value}'\n`
            } else if (isNaN(value)) {
                typeDef += `    ${key}: string\n`
            } else {
                typeDef += `    ${key}: number\n`
            }
        }
    }

    const basename = path.basename(exo, '.exo')
    const converted = KNOWN_TYPE_TEMPLATE.replace(
        /\${name}/g,
        basename.replace(/^\w/, (s) => s.toUpperCase()),
    ).replace(/\${typeDef}/g, typeDef.replace(/\n$/, ''))
    fs.promises.writeFile(path.join(__dirname, '..', 'src', 'types', 'known', `${basename}.ts`), converted)
})
await Promise.all(tasks.map((task) => task()))

const indexTypeDef = exos.map((exo) => KNOWN_TYPE_INDEX_LINE.replace(/\${name}/g, path.basename(exo, '.exo')))
fs.promises.writeFile(path.join(__dirname, '..', 'src', 'types', 'known', 'index.ts'), indexTypeDef.join('\n'))
