import { join } from 'path'
import { readFile } from 'fs-extra'
import { publish as publish2git } from 'gh-pages'

const resolve = (...s: string[]) => join(__dirname, '..', ...s)

type Info = Record<keyof any, unknown>
type Resolve = (...parts: string[]) => string

type Context = {
	info: Info
	resolve: Resolve
	outdir: string
	version: string
}

const main = async () => {
	const info = await readPackageJson(resolve)
	const { name, version } = info
	if ('string' !== typeof name) throw new Error('name must be string')
	if ('string' !== typeof version) throw new Error('version must be string')

	const context: Context = { info, resolve, version, outdir: 'dist' }

	await publishDir(context)

	console.log('done!')
}

const readPackageJson = async (resolve: Resolve): Promise<Info> => {
	const json = JSON.parse(await readFile(resolve('package.json'), 'utf8'))
	if ('object' === typeof json && json) return json
	return {}
}

const publishDir = async ({ resolve, outdir, version }: Context) => {
	await new Promise((r, j) =>
		publish2git(
			resolve(outdir),
			{
				branch: 'gh-pages',
				message: `Release v${version}!!`,
			},
			e => (e ? j(e) : r()),
		),
	)
}

main().catch(x => {
	console.error(x)
	process.exit(1)
})
