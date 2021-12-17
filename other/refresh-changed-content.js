// try to keep this dep-free so we don't have to install deps
const {getChangedFiles, fetchJson} = require('./get-changed-files')

const [currentCommitSha] = process.argv.slice(2)

// try to keep this dep-free so we don't have to install deps
function postRefreshCache({
  http = require('https'),
  postData,
  options: {headers: headersOverrides, ...optionsOverrides} = {},
}) {
  return new Promise((resolve, reject) => {
    try {
      const postDataString = JSON.stringify(postData)
      const searchParams = new URLSearchParams()
      searchParams.set('_data', 'routes/action/refresh-cache')
      const options = {
        hostname: 'bereghici.dev',
        port: 443,
        path: `/action/refresh-cache?${searchParams.toString()}`,
        method: 'POST',
        headers: {
          auth: process.env.REFRESH_CACHE_SECRET,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postDataString),
          ...headersOverrides,
        },
        ...optionsOverrides,
      }

      const req = http
        .request(options, res => {
          let data = ''
          res.on('data', d => {
            data += d
          })

          res.on('end', () => {
            try {
              resolve(JSON.parse(data))
            } catch (error) {
              reject(data)
            }
          })
        })
        .on('error', reject)
      req.write(postDataString)
      req.end()
    } catch (error) {
      console.log('oh no', error)
      reject(error)
    }
  })
}

async function go() {
  const shaInfo = await fetchJson(
    'https://bereghici.dev/refresh-commit-sha.json',
  )
  let compareSha = shaInfo?.sha
  if (!compareSha) {
    const buildInfo = await fetchJson('https://bereghici.dev/build/info.json')
    compareSha = buildInfo.commit.sha
  }
  if (typeof compareSha !== 'string') {
    console.log('🤷‍♂️ No sha to compare to. Unsure what to refresh.')
    return
  }

  const changedFiles =
    (await getChangedFiles(currentCommitSha, compareSha)) ?? []
  const contentPaths = changedFiles
    .filter(f => f.filename.startsWith('content'))
    .map(f => f.filename.replace(/^content\//, ''))
  if (contentPaths.length) {
    console.log(`⚡️ Content changed. Requesting the cache be refreshed.`, {
      currentCommitSha,
      compareSha,
      contentPaths,
    })
    const response = await postRefreshCache({
      postData: {
        contentPaths,
        commitSha: currentCommitSha,
      },
    })
    console.log(`Content change request finished.`, {response})
  } else {
    console.log('🆗 Not refreshing changed content because no content changed.')
  }
}

void go()
