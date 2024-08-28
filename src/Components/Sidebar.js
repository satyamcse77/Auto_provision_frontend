import React from "react";
import styled from "styled-components";
import SidebarDataPage from "./SidebarDataPage";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import Logo from "./Image/logoDark.png";

const SidebarNav = styled.nav`
  background-color: #0a0a0a;
  width: 220px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

const SidebarLogo = styled.img`
  width: 30%;
  margin: 20px auto;
`;

const SidebarTextContainer = styled.div`
  margin-top: auto;
  padding: 20px;
  text-align: center;
  color: #e1e9fc;
`;

const SidebarText = styled.p`
  margin: 5px 0;
  font-size: 12px;
`;

const Sidebar = () => {
  const SidebarData = SidebarDataPage();

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <SidebarNav>
          <SidebarLogo src={Logo} alt="Coral Telecom Logo" />
          <SidebarWrap>
            {SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} />
            ))}
          </SidebarWrap>
          <SidebarTextContainer>
            <SidebarText>Coral Telecom</SidebarText>
            <SidebarText>Version - 1.0</SidebarText>
          </SidebarTextContainer>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
