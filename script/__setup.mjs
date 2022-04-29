//@ts-check
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

global.__dirname = path.dirname(fileURLToPath(import.meta.url))

export const WORKSPACES = await fs.promises.readdir(path.join(__dirname, '../modules'))
