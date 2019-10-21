import { remove } from 'fs-extra'
import { join } from 'path'

remove(join(__dirname, '..', 'dist')).catch(x => {
	console.error(x)
	process.exit(1)
})
