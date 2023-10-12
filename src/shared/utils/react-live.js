export const codeAdd = (placeholder) => `
import { createHelia } from 'helia'
import { strings } from '@helia/strings'

const helia = await createHelia()
const s = strings(helia)

const data = '${placeholder}'

// add your data to Helia
const cid = await s.add(data)

// CID (Content IDentifier) uniquely addresses the data
// and can be used to get it again.
console.log(cid.toString())
`

export const codeGet = (cid) => `
import { createHelia } from 'helia'
import { strings } from '@helia/strings'
import { CID } from 'multiformats/cid'

const helia = await createHelia()
const s = strings(helia)

// this is the CID from the "add" example
const cid = CID.parse('${cid}')
const data = await s.get(cid)

console.log(data)
`

export function runCode (code, scope) {
  const entries = Object.entries(scope)
  // eslint-disable-next-line no-new-func
  const res = new Function(...entries.map(e => e[0]), `return (async () => { ${code} })()`)
  return res(...entries.map(e => e[1]))
}

export function log (fn) {
  return {
    error: fn,
    log: fn,
    warning: fn
  }
}

export async function createHelia (opts) {
  const { createHelia } = await import('helia')
  const node = await createHelia()
  return node
}
