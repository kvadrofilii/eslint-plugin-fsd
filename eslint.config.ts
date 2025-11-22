import { defineConfig, globalIgnores } from 'eslint/config'

import { configs, GLOB_EXCLUDE } from '@michael-yakovlev/eslint-config'

export default defineConfig([configs.base(), configs.prettier], globalIgnores([...GLOB_EXCLUDE]))
