//@ts-check
import path from 'path'
import { fileURLToPath } from 'url'

global.__dirname = path.dirname(fileURLToPath(import.meta.url))
