import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { FaServer } from 'react-icons/fa6';
import { MdWifi, MdNetworkCell, MdChecklist, MdOutlineDisabledByDefault, MdFileUpload } from 'react-icons/md';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { CiTimer } from 'react-icons/ci';
import { IoSettings, IoLogOutOutline } from 'react-icons/io5';
import { BsTelephoneFill } from 'react-icons/bs';
import { LiaHistorySolid } from 'react-icons/lia';
import { AiOutlineOrderedList } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SidebarDataPage = () => {
 
  const navigate = useNavigate();

  const logOutCall = async () => {
    await Cookies.remove("session");
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate("/log-in");
  };

  const iconColor = { color: '#9cf2ff' };

  const SidebarData = [
    {
      title: 'Dashboard',
      path: '/',
      onClick: '',
      icon: <AiIcons.AiFillHome style={iconColor} />
    },
    {
      title: 'Device Detail',
      icon: <BsTelephoneFill style={iconColor} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={iconColor} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={iconColor} />,
      subNav: [
        {
          title: 'Online Devices',
          path: "/online-devices",
          icon: <BsTelephoneFill style={iconColor} />
        },
        {
          title: 'Listing Device',
          path: '/listing-devices',
          icon: <AiOutlineOrderedList style={iconColor} />
        },
        {
          title: 'File Upload',
          path: '/fileUploadList',
          icon: <MdFileUpload style={iconColor} />
        }
      ]
    },
    {
      section: 'Device Management'
    },
    {
      title: 'IP phone',
      icon: <AiIcons.AiFillPhone style={iconColor} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={iconColor} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={iconColor} />,
      subNav: [
        {
          title: 'Coral IP2LG',
          path: '/Ip-Phone-Provisioning',
          icon: <IoIcons.IoIosPaper style={iconColor} />
        },
        {
          title: 'Cisco CP-3905',
          path: '/cisco_CP-3905',
          icon: <IoIcons.IoIosPaper style={iconColor} />
        }
      ]
    },
    {
      title: 'Servers',
      icon: <FaServer style={iconColor} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={iconColor} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={iconColor} />,
      subNav: [
        {
          title: '5G core',
          path: '/linux-provisioning',
          icon: <MdNetworkCell style={iconColor} />,
          cName: 'sub-nav'
        },
        {
          title: 'Iot Gateway',
          path: '/iot_gateway',
          icon: <MdWifi style={iconColor} />,
          cName: 'sub-nav'
        }
      ]
    },
    {
      section: 'Scheduling'
    },
    {
      title: 'Scheduling',
      icon: <RiCalendarScheduleFill style={iconColor} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={iconColor} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={iconColor} />,
      subNav: [
        {
          title: 'Auto Scheduling',
          path: '/time-schedule',
          icon: <CiTimer style={iconColor} />,
          cName: 'sub-nav'
        },
        {
          title: 'Auto Update List',
          path: '/auto-update',
          icon: <MdChecklist style={iconColor} />,
          cName: 'sub-nav'
        }
      ]
    },
    {
      section: 'System Settings'
    },
    {
      title: 'System Settings',
      path: '/system-setting',
      icon: <IoSettings style={iconColor} />
    },
    {
      title: 'Fault Logs',
      path: '/fault',
      icon: <MdOutlineDisabledByDefault style={iconColor} />
    },
    {
      title: 'History',
      path: '/history',
      icon: <LiaHistorySolid style={iconColor} />
    },
    {
      section: 'Logout'
    },
    {
      title: 'Logout',
      onClick: logOutCall,
      icon: <IoLogOutOutline style={iconColor} />
    }
  ];

  return SidebarData;
};

export default SidebarDataPage;
