import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import path from 'path'
import { Title, Image, Tags, Tag } from './item.css'

const Item = ({ name, images, genres }) => (
  <figure>
    { get(images, '[0].url') ?
      <Image src={get(images, '[0].url', '')} alt={name} />
    : <Image src='https://picsum.photos/640/640/?blur=2' alt={name} /> }
    
    <figcaption>
      <Title>{name}</Title>
      <Tags>{genres.map(x => <Tag key={`${name}-${x}`}>{x}</Tag>)}</Tags>
    </figcaption>
  </figure>
)

export default Item
