import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Sidebar from '../Sidebar';
import Header from './header';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend);

const OnlinePie = () => {

  const [apiData, setApiData] = useState(0);
  const [onlineDevices, setOnlineDevices] = useState(0);
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Token) {
      navigate("/log-in");
    }

    const fetchAuth = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlTr069}:${PORTTr069}/checkAuth`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + TokenData.AuthToken,
            },
          }
        );

        const data = await response.json();
        if (data.status !== 1) {
          navigate("/log-in");
        }
      } catch (error) {
        console.error("Error fetching auth data:", error);
        navigate("/log-in");
      }
    };

    const fetchDevices = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/onlineDevices`,
          {
            method: "GET",
            headers: {
              Authorization: Token,
            },
          }
        );
        const data = await response.json();
        if (data) {
         
         await setOnlineDevices(data.value);
          await setApiData(data.total);
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchAuth();
    fetchDevices();
  }, [BaseUrlTr069, PORTTr069, Token, navigate, BaseUrlSpring, PORTSpring, setOnlineDevices]);

  const data = {
    labels: ['Online Devices', 'Offline Devices'],
    datasets: [
      {
        label: '# of Devices',
        data: [onlineDevices, apiData],
        backgroundColor: ['#31a354', '#0098c8 '],
        borderColor: ['#31a354', '#0058c8'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <>
      <Sidebar />
      <Header 
        Title="Online Devices"
        breadcrumb="/Device Detail/Online Devices "
      />
      <div className="pie-chart-container">
        <h2>Online Devices</h2>
        <div className="pie-chart">
          <Pie data={data} options={options} />
        </div>
      </div>
    </>
  );
};

export default OnlinePie;
