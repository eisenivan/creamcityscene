import React from 'react'
import PropTypes from 'prop-types'
import { Title, Image, Tags, Tag } from './item.css'

const Item = ({ name, images, genres }) => (
  <figure>
    <Image src={images[0].url} alt={name} />
    <figcaption>
      <Title>{name}</Title>
      <Tags>{genres.map(x => <Tag key={`${name}-${x}`}>{x}</Tag>)}</Tags>
    </figcaption>
  </figure>
)

Item.propTypes = {
  title: PropTypes.string,
  copy: PropTypes.string,
  image: PropTypes.object.isRequired
}

export default Item
