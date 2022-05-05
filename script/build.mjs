import { execSync } from 'child_process'
import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import glob from 'tiny-glob'
import typescript from 'typescript'

import { WORKSPACES } from './__setup.mjs'

WORKSPACES.forEach(async (module) => {
    const dir = path.join(__dirname, '../modules', module)

    const packageJson = JSON.parse(await fs.promises.readFile(path.join(dir, 'package.json'), 'utf8'))
    if (packageJson.scripts && packageJson.scripts.prebuild) {
        console.log(`Found prebuild script for ${module}`)
        execSync(`yarn prebuild`, { stdio: 'inherit' })
    }
    const files = await glob(path.join(dir, 'src/**/*.{ts,tsx}'))

    /**
     * Build module with esbuild
     */

    /** @type {import("esbuild").BuildOptions} */
    const options = {
        entryPoints: [path.join(dir, packageJson.main)],
        platform: 'node',
        bundle: true,
        external: [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.devDependencies || {})],
    }

    esbuild
        .build({
            ...options,
            outdir: path.join(dir, 'dist', 'cjs'),
            format: 'cjs',
            outExtension: {
                '.js': '.cjs',
            },
        })
        .then(() => console.log(`${module} cjs build complete`))
    esbuild
        .build({
            ...options,
            outdir: path.join(dir, 'dist', 'esm'),
            format: 'esm',
            outExtension: {
                '.js': '.mjs',
            },
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
