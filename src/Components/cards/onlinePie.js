import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Sidebar from "../Sidebar";
import Header from "./header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend);

const OnlinePie = () => {

  const [apiData, setApiData] = useState(0);
  const [onlineDevices, setOnlineDevices] = useState(0);
  const BaseUrlSpring = "192.168.250.51" || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = "192.168.250.51" || "localhost";
  const PORTTr069 = "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Token) {
      navigate("/");
    }
    const TokenData = JSON.parse(Token);
    const fetchAuth = async () => {
      try {
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
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching auth data:", error);
        navigate("/");
      }
    };

    const fetchDevices = async () => {
      try {
        let response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/allData`,
          {
            method: "GET",
            headers: {
              Authorization: TokenData.AuthToken,
            },
          }
        );
        response = await response.json();
        if (response) {
          let count = 0,
            total = 0;
          response.forEach((item) => {
            if (item.active) {
              count++;
            }
            if (item) total++;
          });
          setApiData(total - count);
          setOnlineDevices(count);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAuth();
    fetchDevices();
  }, [
    BaseUrlTr069,
    PORTTr069,
    Token,
    navigate,
    BaseUrlSpring,
    PORTSpring,
    setOnlineDevices,
  ]);

  const data = {
    labels: ["Online Devices", "Offline Devices"],
    datasets: [
      {
        label: "# of Devices",
        data: [onlineDevices, apiData],
        backgroundColor: ["#31a354", "#0098c8 "],
        borderColor: ["#31a354", "#0058c8"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
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
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              color: "green",
              margin: "5px 0",
            }}
          >
            Online devices: {onlineDevices}
          </h2>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              color: "#dc3545",
              margin: "5px 0",
            }}
          >
            Offline devices: {apiData}
          </h2>
        </div>
        <div style={{ marginTop: "50px" }}>
            {!apiData && (
              <span style={{ color: "red" }}>
                No devices are present.
              </span>
            )}
      </div>
      </div>
    </>
  );
};

export default OnlinePie;
