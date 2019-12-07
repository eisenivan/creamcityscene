import styled from 'styled-components'
import MEDIA from 'helpers/mediaTemplates'

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 4rem;
  padding: 0 4rem;
  margin: 2rem 0;

  ${MEDIA.TABLET`
    grid-template-columns: repeat(2, 1fr);;
  `};

  ${MEDIA.PHONE`
    display: block;
  `};
`
