import React, { useEffect, useState } from "react";
import DashboardCard from "./cards/index";
import { Container, Row, Col } from "react-bootstrap";
import { FaMobileAlt, FaClock, FaHistory } from "react-icons/fa";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PieChartComponent from "./cards/Piechart";
import Header from './cards/header'

const Dashboard = () => {

  const navigate = useNavigate();
  const [timeschedule, setTimeschedule] = useState(0);
  const [countHistory, setCountHistory] = useState(0);
  const [systemHealth, setSystemHealth] = useState(null);
  const [onlineDevices, setOnlineDevices] = useState(0);
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const BaseUrlNode = process.env.REACT_APP_API_NODE_URL || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);

  useEffect(() => {
    if(!Token) navigate("/log-in");
    const fetchData = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(`http://${BaseUrlTr069}:${PORTTr069}/checkAuth`, {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        });
        const data = await response.json();
        if (data.status !== 1) {
          navigate("/log-in");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();


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
         
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };
    fetchDevices();

    const fetchData2 = async () => {
      try {
        const response = await fetch(`http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/all`, {
          method: "GET",
          headers: {
            Authorization: Token,
          },
        });
         await response.json();
       
       
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData2();

    const fetchData3 = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerAutoDeploy/allAutoDeployData`,
          {
            method: "GET",
            headers: {
              Authorization: Token,
            },
          }
        );
        const data = await response.json();
        setTimeschedule(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData3();

    const fetchData4 = async () => {
      try {
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerHistory/historys`,
          {
            method: "GET",
            headers: {
              Authorization: Token,
            },
          }
        );
        const data = await response.json();
        setCountHistory(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData4();

    const fetchData5 = async () => {
      try {
        const response = await fetch(`http://${BaseUrlNode}:${PORTNode}/systemHealth`, {
          method: "GET",
          headers: {
            Authorization: Token,
          },
        });
        const data = await response.json();
       
        if (data.status === 0) {
          setSystemHealth(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData5();
  }, [navigate,setOnlineDevices, BaseUrlSpring, PORTSpring, BaseUrlNode, PORTNode, BaseUrlTr069, PORTTr069, Token, systemHealth]);

  return (
    <>
      <Navbar />
      <Header
      Title="Auto Provisioning Dashboard"
      breadcrumb="/dashboard"/>
      <Container fluid className="dashboard-container rows-flex">
        <Row className="dashboard-row column-flex">
          <Col md={3}>
            <DashboardCard
              className="dash-card"
              title="Online devices"
              value={onlineDevices? onlineDevices:""}
              color="#8cbed6"
              icon={<FaMobileAlt />}
            />
          </Col>
          <Col md={3}>
            <DashboardCard
              className="dash-card"
              title="Time schedule"
              value={timeschedule?timeschedule:""}
              color="#8cbed6"
              icon={<FaClock />}
            />
          </Col>
          <Col md={3}>
            <DashboardCard
              className="dash-card"
              title="Total histories"
              value={countHistory?countHistory:""}
              color="#8cbed6"
              icon={<FaHistory />}
            />
          </Col>
        </Row>

        <Row className="dashboard-row">
          <Col md={3}>
            {systemHealth !== null && <PieChartComponent 
            memUsage={systemHealth.data.totalCpu} 
            title ="CPU Usage"
            used = 'CPU Used'
            unused = 'CPU Unused'
            />}
            
          </Col>
          <Col md={3}>
            {systemHealth !== null && <PieChartComponent 
            memUsage={systemHealth.data.diskUsage.diskUsage}
            title = "Disk Usage"
            used = 'Disk Used'
            unused = 'Disk Unused'
            />}
          </Col>
          <Col md={3}>
            {systemHealth !== null && <PieChartComponent 
            memUsage={systemHealth.data.ramUsage.memUsage}
            title = "RAM Usage"
            used = 'RAM Used'
            unused = 'RAM Unused'
            />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
