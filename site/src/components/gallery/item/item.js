import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import { Title, Image, Tags, Tag } from './item.css'

const Item = ({ name, images, genres, external_urls: externalUrls }) => (
  <figure>
    { get(images, '[0].url')
      ? <Image src={get(images, '[0].url', '')} alt={name} />
      : <Image src='https://picsum.photos/640/640/?blur=2' alt={name} /> }

    <figcaption>
      <Title>
        <a target='blank' href={externalUrls.spotify}>
          {name}
        </a>
      </Title>
      <Tags>{genres.map(x => <Tag key={`${name}-${x}`}>{x}</Tag>)}</Tags>
    </figcaption>
  </figure>
)

Item.propTypes = {
  name: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.object),
  genres: PropTypes.array,
  external_urls: PropTypes.object
}

export default Item
