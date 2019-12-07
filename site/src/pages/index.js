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
      <Gallery items={data.allArtistinfoJson.nodes} />
    </Playlist>
  </Layout>
)

Index.propTypes = {
  data: PropTypes.object.isRequired
}

export default Index

export const query = graphql`
  query HomepageQuery {
    allArtistinfoJson {
      nodes {
        body {
          images {
            url
          }
          name
          popularity
          genres
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
