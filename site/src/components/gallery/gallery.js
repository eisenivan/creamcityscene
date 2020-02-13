import React from 'react'
import PropTypes from 'prop-types'
import Item from 'components/gallery/item'
import { Container, DateTitle } from './gallery.css'

const Gallery = ({ days }) => (
  <div>
    {days.map((day) => (
      <div key={day.edges[0].node.start.date}>
        <DateTitle>{day.edges[0].node.start.date}</DateTitle>
        <Container>
          {day.edges.map((item, i) => (
            <Item {...item.node} key={`${i}-${day.edges[0].node.start.date}`} />
          ))}
        </Container>
      </div>
    ))}
  </div>
)

Gallery.propTypes = {
  days: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Gallery
