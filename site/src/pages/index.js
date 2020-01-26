import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/layout'
import Box from 'components/box'
import Title from 'components/title'
import Gallery from '../components/gallery'
import Playlist from 'components/playlist'
import { graphql } from 'gatsby'

const Index = ({ data }) => (
  <Layout>
    <Box>
      <Title as='h2' size='large'>
        {data.homeJson.content.childMarkdownRemark.rawMarkdownBody}
      </Title>
    </Box>

    <Playlist>
      <Gallery days={data.allArtistinfoJson.group} />
    </Playlist>
  </Layout>
)

Index.propTypes = {
  data: PropTypes.object.isRequired
}

export default Index

export const query = graphql`
  query HomepageQuery {
    allArtistinfoJson(sort: {fields: body___start___date, order: ASC}) {
      group(field: body___start___date) {
        edges {
          node {
            body {
          images {
            url
          }
          external_urls {
            spotify
          }
          name
          popularity
          genres
          start {
            date(formatString: "M/D/YYYY")
          }
        }
          }
        }
      }
    }
    homeJson {
      title
      content {
        childMarkdownRemark {
          html
          rawMarkdownBody
        }
      }
      gallery {
        title
        copy
      }
    }
  }
`
