import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Tabs from "./cards/Tabs";
import Header from "./cards/header";
import Switch from "@mui/material/Switch";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SystemSetting() {

  const [subnet, setSubnet] = useState("");
  const [netmask, setNetmask] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [routers, setRouters] = useState("");
  const [domain, setDomain] = useState("");
  const [tftpServerName, setTftpServerName] = useState("");
  const [DhcpOn, setDhcpOn] = useState(false);
  const [TftpOn, setTftpOn] = useState(false);
  const navigate = useNavigate();
  const Token = Cookies.get(process.env.REACT_APP_COOKIENAME || "auto provision");
  const BaseUrlTr069 = "192.168.250.51" || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = "192.168.250.51" || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "4058";
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      if (!Token) navigate("/");
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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status !== 1) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/");
    }
  };

  const fetchData2 = async () => {
    try {

      const TokenData = JSON.parse(Token);
      const DhcpStart = "2";
      const TftpStart = "2";
      const url = `http://${BaseUrlNode}:${PORTNode}/checkStatus`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + TokenData.AuthToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DhcpStart: DhcpStart,
          TftpStart: TftpStart,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        setDhcpOn(data.data.Dhcp === 1);
        setTftpOn(data.data.Tfcp === 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData2();
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const dhcpConfig = {
      subnet: subnet,
      netmask: netmask,
      range: { start: rangeStart, end: rangeEnd },
      routers: routers,
      tftpServerName: tftpServerName,
      dns: domain,
    };
    try {
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/submitDHCPConfig`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Token,
          },
          body: JSON.stringify(dhcpConfig),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        alert("DHCP configuration set successfully.");
        window.location.reload();
      } else {
        alert("Failed to set DHCP configuration.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting DHCP configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = async (event) => {
    try {
      setIsLoading(true);
      const TokenData = JSON.parse(Token);
      const DhcpStart = DhcpOn ? "0" : "1";
      const TftpStart = "2";
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/checkStatus`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DhcpStart: DhcpStart,
            TftpStart: TftpStart,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        (await data.data.Dhcp) === 1 ? setDhcpOn(true) : setDhcpOn(false);
        fetchData2();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange2 = async (event) => {
    try {
      setIsLoading(true);
      const TokenData = JSON.parse(Token);
      const TftpStart = TftpOn ? "0" : "1";
      console.log(TftpStart);
      const url = `http://${BaseUrlNode}:${PORTNode}/checkStatus`;
      const DhcpStart = "2";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + TokenData.AuthToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DhcpStart: DhcpStart,
          TftpStart: TftpStart,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        (await data.data.Tfcp) === 1 ? setTftpOn(true) : setTftpOn(false);
        fetchData2();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatusSwitch = ({ DhcpOn, onSwitchChange }) => {
    const switchColor = DhcpOn ? "green" : "red";
    return (
      <Switch
        checked={DhcpOn}
        onChange={onSwitchChange}
        style={{ color: switchColor }}
        color="default"
      />
    );
  };

  const [activeTab, setActiveTab] = useState("Status");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Configuration":
        return (
          <div className="system-settings-content">
            <form className="system-settings-form" onSubmit={handleSubmit}>
              <div className="form-group-flex">
                <div className="form-group90">
                  <label htmlFor="subnet">Subnet:</label>
                  <input
                    type="text"
                    id="subnet"
                    name="subnet"
                    className="input-field"
                    value={subnet}
                    onChange={(e) => setSubnet(e.target.value)}
                  />
                </div>
                <div className="form-group90">
                  <label htmlFor="netmask">Netmask:</label>
                  <input
                    type="text"
                    id="netmask"
                    name="netmask"
                    className="input-field"
                    value={netmask}
                    onChange={(e) => setNetmask(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group-flex">
                <div className="form-group90">
                  <label htmlFor="rangeStart">Pool start:</label>
                  <input
                    type="text"
                    id="rangeStart"
                    name="rangeStart"
                    className="input-field"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                  />
                </div>
                <div className="form-group90">
                  <label htmlFor="rangeEnd">Pool end:</label>
                  <input
                    type="text"
                    id="rangeEnd"
                    name="rangeEnd"
                    className="input-field"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group-flex">
                <div className="form-group90">
                  <label htmlFor="routers">Option Routers:</label>
                  <input
                    type="text"
                    id="routers"
                    name="routers"
                    className="input-field"
                    value={routers}
                    onChange={(e) => setRouters(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group-flex">
                <div className="form-group90">
                  <label htmlFor="domain">Option Domain Name Servers:</label>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    className="input-field"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <div className="form-group90">
                  <label htmlFor="Tftp">
                    Tftp server name:
                  </label>
                  <input
                    type="text"
                    id="DHCP"
                    name="DHCP"
                    className="input-field"
                    value={tftpServerName}
                    onChange={(e) => setTftpServerName(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group-flex">
              </div>
              <div className="form-group-flex">
              </div>
              <div className="form-group-flex">
                <button type="submit" className="button21">
                  Submit
                </button>
              </div>
            </form>
          </div>
        );
      case "Status":
        return (
          <>
            {(!DhcpOn && !TftpOn) && (<span style={{ color: "red" }}>Ensure that DHCP and TFTP services are installed only then its work.</span>)}
            <div className="system-setting-status" style={{ marginTop: "20px" }}>
              <div className="setting-item">
                <h3>DHCP</h3>
                <StatusSwitch
                  DhcpOn={DhcpOn}
                  onSwitchChange={handleSwitchChange}
                />
              </div>
            </div>
            <div className="system-setting-status" style={{ marginTop: "20px" }}>
              <div className="setting-item">
                <h3>TFTP</h3>
                <StatusSwitch
                  DhcpOn={TftpOn}
                  onSwitchChange={handleSwitchChange2}
                />
              </div>
            </div>
          </>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <>
      <Sidebar />
      <Header Title="System Settings" breadcrumb="/System Settings" />
      <div className="system-settings-tab">
        <Tabs
          tabs={["Status", "Configuration"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {renderTabContent()}

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ color: "white", fontSize: "30px", display: "flex", alignItems: "center" }}>
            <AiOutlineLoading3Quarters
              style={{
                animation: "spin 2s linear infinite",
                marginRight: "10px",
              }}
            />
            Please wait... while we are saveing the data.
          </div>
        </div>
      )}
    </>
  );
}
