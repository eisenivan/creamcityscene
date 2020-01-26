import styled from 'styled-components'
import MEDIA from 'helpers/mediaTemplates'

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 4rem;
  padding: 0 4rem 4rem;
  margin: 2rem 0;
  border-bottom: 1px solid tomato;
  margin-bottom: 2rem;

  ${MEDIA.MIN_XLARGE`
  grid-template-columns: repeat(3, 1fr);
  `}

  ${MEDIA.PHONE`
    display: block;
  `};
`

export const DateTitle = styled.h2`
  text-transform: uppercase;
  font-size: 1.6rem;
  font-weight: 900;
  margin-left: 2rem;
`
