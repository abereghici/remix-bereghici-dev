module.exports = {
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
    `npm run format --`,
    `npm run typecheck --silent --`,
    `npm run lint --silent --`,
    `npm run test --silent --watch=false --findRelatedTests --`,
  ],
}
