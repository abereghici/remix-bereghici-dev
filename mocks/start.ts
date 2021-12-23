import {setupServer} from 'msw/node'
import {githubHandlers} from './github'
import {isE2E} from './utils'

const server = setupServer(...githubHandlers)

server.listen({onUnhandledRequest: 'warn'})
console.info('🔶 Mock server installed')
if (isE2E) console.info('running in E2E mode')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
