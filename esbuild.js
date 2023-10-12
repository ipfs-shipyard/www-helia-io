import { build, context } from 'esbuild'

/*
TODO: replace mkdir/cp commands from package.json build script
import { promisify } from 'node:util'
import c from 'copy'
const copy = promisify(c)

await copy('./static', 'dist', {
  srcBase: 'src'
})
*/

/**
 * @type {import('esbuild').BuildOptions}
 */
const config = {
  entryPoints: ['./src/index.jsx'],
  outfile: './dist/index.js',
  sourcemap: 'linked',
  minify: true,
  bundle: true,
  define: {
    'process.env.NODE_DEBUG': 'false',
    global: 'globalThis'
  },
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.gif': 'file',
    '.pdf': 'file',
    '.svg': 'file',
    '.woff': 'file',
    '.woff2': 'file'
  }
}

if (process.argv[2] === 'serve') {
  const result = await context(config)
  const serveResult = await result.serve({
    servedir: './dist'
  })

  console.info(`Server listening on http://127.0.0.1:${serveResult.port}`)
} else {
  await build(config)
    .catch(() => process.exit(1))
}
