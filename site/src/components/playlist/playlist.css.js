import styled from 'styled-components'
import MEDIA from 'helpers/mediaTemplates'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 4rem;
  padding: 0 4rem;
  margin: 2rem 0;

  ${MEDIA.TABLET`
    display: flex;
    flex-direction: column-reverse;
  `};
`

export const IframeContainer = styled.div`
  ${MEDIA.TABLET`
    margin-top: 4rem;
    margin-left: 4rem;
  `};

  ${MEDIA.PHONE`
    margin-left: 0rem;
  `};
`
