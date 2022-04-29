import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { WORKSPACES } from './__setup.mjs'

const dryRun = process.argv.includes('--dry-run')

const getTag = () => {
    try {
        const tagList = execSync(`yarn npm tag list --json`)
        return JSON.parse(tagList.toString()).locator
    } catch (error) {
        return
    }
}

WORKSPACES.forEach(async (module) => {
    const dir = path.join(__dirname, '../modules', module)
    process.chdir(dir)

    const { name, version } = JSON.parse(await fs.promises.readFile(path.join(dir, 'package.json'), 'utf8'))
    const latest = getTag()

    if (latest && version === latest) {
        console.log(`${name}@${version} already published`)
    } else {
        if (!dryRun) execSync(`yarn npm publish --access public --tag latest`, { stdio: 'inherit' })
        console.log(`${name}@${version} published`)
    }
})
