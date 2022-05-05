import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { WORKSPACES } from './__setup.mjs'

const dryRun = process.argv.includes('--dry-run')

/**
 * @param {string} cwd
 * @returns {Record<string, string> | undefined}
 */
const getTag = (cwd) => {
    try {
        const tagList = execSync(`yarn npm tag list --json`, { cwd })
        return JSON.parse(tagList.toString()).locator.split('@').pop()
    } catch (error) {
        return
    }
}

WORKSPACES.forEach(async (module) => {
    const cwd = path.join(__dirname, '../modules', module)

    const { name, version } = JSON.parse(await fs.promises.readFile(path.join(cwd, 'package.json'), 'utf8'))
    const latest = getTag(cwd)
    
    if (latest && version === latest) {
        console.log(`${name}@${version} already published`)
    } else {
        if (!dryRun) execSync(`yarn npm publish --access public --tag latest`, { stdio: 'inherit', cwd })
        console.log(`${name}@${version} published`)
    }
})
