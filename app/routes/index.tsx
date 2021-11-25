import ResponsiveContainer from '~/components/responsive-container'
import {H1, H2, H3, H4, H5, H6, Paragraph} from '~/components/typography'

export default function IndexRoute() {
  return (
    <ResponsiveContainer>
      <H1>Test</H1>
      <H2>Test</H2>
      <H3>Test</H3>
      <H4>Test</H4>
      <H5>Test</H5>
      <H6>Test</H6>
      <Paragraph>This is a test</Paragraph>
      <Paragraph variant="secondary">This is a test</Paragraph>
    </ResponsiveContainer>
  )
}
