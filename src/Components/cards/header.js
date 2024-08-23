// Header.js
import React from 'react';
import styled from 'styled-components';

// Styled components
const HeaderContainer = styled.header`
  display: flex;
  margin-left: 200px;
  justify-content: space-between;
  align-items: center;
  background-color: #0a0a0a ;
  height: 85px;
  color: white;
  padding: 0 20px;
  position: relative;
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: bold;

`;

const Breadcrumb = styled.div`
  position: absolute;
  bottom: 5px;
  right: 20px;
  font-size: 14px;
`;

const Header = ({ Title, breadcrumb }) => {
  return (
    
    <HeaderContainer>
    <Logo >{Title}</Logo>
    <Breadcrumb>{breadcrumb}</Breadcrumb>
    </HeaderContainer>

  );
};

export default Header;
