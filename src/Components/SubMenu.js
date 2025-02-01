import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MdMenuBook } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 40px;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 40px;
  padding-left: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 14px;

  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

const SectionTitle = styled.div`
  padding: 5px;
  color: #ccb902;
  font-size: 10px;
  text-align: left; 
  text-transform: uppercase;
`;

const SubMenu = ({ item }) => {

  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  if (item.section) {
    return <SectionTitle>{item.section}</SectionTitle>;
  }

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  }

  const GoLink = () => {
    window.open("http://170.187.248.8/ACS-tr-069-server/", "_blank");
  }

  const GoListDevice = () => {
    navigate("/listing-devices");
  } 

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav ? showSubnav : item.onClick}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
              ? item.iconClosed
              : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((subItem, index) => {
          return (
            <DropdownLink to={subItem.path} key={index}>
              {subItem.icon}
              <SidebarLabel>{subItem.title}</SidebarLabel>
            </DropdownLink>
          );
        })}

      <Outlet />
      <div className="voice-button">
        <MdMenuBook size={27} onClick={handleMenuClick} />
      </div>

      {showMenu && (
        <div className="voice-popup">
          <div className="voice-popup-content">
            <button className="menu-item" onClick={GoLink}>App deb</button>
            <button className="menu-item" onClick={GoListDevice}>List device</button>
          </div>
        </div>
      )}

    </>
  );
};

export default SubMenu;
