import React from 'react'
import PropTypes from 'prop-types'
import { Container, IframeContainer } from './playlist.css'

const Playlist = ({ children }) => (
  <Container>
    <IframeContainer>
      <iframe title='Playing in Milwaukee tonight playlist' src='https://open.spotify.com/embed/playlist/2a6r9HrB1x3rxBqlhb2qSn' width='300' height='500' frameBorder='0' allowTransparency='true' allow='encrypted-media' />
    </IframeContainer>
    {children}
  </Container>
)

Playlist.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.children
}

export default Playlist
