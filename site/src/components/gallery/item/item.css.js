import styled from 'styled-components'
import MEDIA from 'helpers/mediaTemplates'

export const Title = styled.span`
  display: block;
  font-size: 2rem;
  font-weight: 500;
  margin: 2rem 0rem 1rem;
`
export const Image = styled.img`
  max-width: 100%;
  max-height: 320px;
  object-fit: cover;
`

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${MEDIA.PHONE`
    margin-bottom: 4rem;
  `};
`

export const Tag = styled.span`
  background: tomato;
  color: white;
  margin: 0.25rem;
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
`
