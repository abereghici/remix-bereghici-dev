/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  devServerPort: 8002,
  ignoredRouteFiles: ['.*'],
  serverPlatform: 'node',
  routes(defineRoutes) {
    return defineRoutes(route => {
      if (process.env.ENABLE_TEST_ROUTES === 'true') {
        if (process.env.NODE_ENV === 'production' && process.env.FLY_APP_NAME) {
          console.warn(
            `🚨 🚨 🚨 🚨 ENABLE_TEST_ROUTES is true, NODE_ENV is "production" and FLY_APP_NAME is ${process.env.FLY_APP_NAME} so we're not going to enable test routes because this is probably a mistake. We do NOT want test routes enabled on Fly. 🚨 🚨 🚨 🚨 🚨`,
          )
          return
        }
        route(
          '__tests/github/authenticate',
          '__test_routes__/github/authenticate.tsx',
        )
      }
    })
  },
}
