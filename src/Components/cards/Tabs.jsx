// src/components/Tabs.js
import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  cursor: pointer;
  margin-left:240px;
  margin-top: 20px;
  margin-bottom: 20px; /* Space below the tabs */
`;

const Tab = styled.div`
  padding: 10px 20px;
  margin: 0 5px;
  background: ${props => (props.active ? '#eee' : '#transparent')};
  color: ${props => (props.active ? '#303030' : '#fff')};
  border-radius: 5px;
  font-weight: bold;
  transition: background 0.3s;
  &:hover {
    background: ${props => (props.active ? '#333' : '#bbb')};
  }
`;

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <TabsContainer>
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
