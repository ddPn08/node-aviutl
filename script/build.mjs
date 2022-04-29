import { execSync } from 'child_process'
import esbuild from 'esbuild'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import typescript from 'typescript'

import { WORKSPACES } from './__setup.mjs'

WORKSPACES.map(async (module) => {
    const dir = path.join(__dirname, '../modules', module)
    process.chdir(dir)

    const packageJson = JSON.parse(await fs.promises.readFile(path.join(dir, 'package.json'), 'utf8'))
    if (packageJson.scripts && packageJson.scripts.prebuild) {
        console.log(`Found prebuild script for ${module}`)
        execSync(`yarn prebuild`, { stdio: 'inherit' })
    }

    const files = glob.sync(`src/**/*.ts`).map((file) => path.resolve(file))

    /**
     * Build module with esbuild
     */

    /** @type {import("esbuild").BuildOptions} */
    const options = {
        entryPoints: files,
        platform: 'node',
    }

    esbuild
        .build({
            ...options,
            outdir: path.join(dir, 'dist', 'cjs'),
            format: 'cjs',
        })
        .then(() => console.log(`${module} cjs build complete`))
    esbuild
        .build({
            ...options,
            outdir: path.join(dir, 'dist', 'esm'),
            format: 'esm',
        })
        .then(() => console.log(`${module} esm build complete`))

    /**
     * Emit declaration files
     */

    const program = typescript.createProgram(files, {
        declaration: true,
        declarationDir: path.join('dist', 'types'),
        emitDeclarationOnly: true,
    })
    const emitResult = program.emit()
    const diagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
    if (diagnostics.length < 1) console.log(`${module} declaration files emitted`)
    diagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            const { line, character } = typescript.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start)
            const msg = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${msg}`)
        } else {
            console.log(`${typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
        }
    })
})
