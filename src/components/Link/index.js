import React from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';

const LinkQuizes = styled.a`
  transition: all 200ms;
  &:hover{
    background-color: ${({ theme }) => theme.colors.primary}
  }
`

export default function Link({children, href, ...props}) {
  return (
    <NextLink href={href} passHref>
      <LinkQuizes {...props}>
        {children}
      </LinkQuizes>
    </NextLink>
  )
} 