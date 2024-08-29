import React, { useEffect, useState } from "react";
import Navbar from "../../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Shell from "../../terminal";
import Header from "../../cards/header";
import Core from "../../Image/core.png";

const LinuxProvisioning = () => {
  const navigate = useNavigate();
  const [shellData, setShellData] = useState(
    "Welcome to linux Shell! This is a read-only shell."
  );
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const BaseUrlNode = process.env.REACT_APP_API_NODE_URL || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);
  const [ipAddresses, setIpAddresses] = useState([""]);

  useEffect(() => {
    if (!Token) navigate("/log-in");
    const fetchData = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlTr069}:${PORTTr069}/checkAuth`,
          {
            method: "post",
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
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate, BaseUrlTr069, PORTTr069, Token]);

  const handleInputChange = (index, value) => {
    const updatedIpAddresses = [...ipAddresses];
    updatedIpAddresses[index] = value;
    setIpAddresses(updatedIpAddresses);
  };

  const addIpAddress = () => {
    setIpAddresses([...ipAddresses, ""]);
  };

  const removeIpAddress = (index) => {
    const updatedIpAddresses = [...ipAddresses];
    updatedIpAddresses.splice(index, 1);
    setIpAddresses(updatedIpAddresses);
  };

  const RebootCall = async () => {
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/linuxReboot`,
        {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
          body: JSON.stringify({ devices: ipAddresses }),
        }
      );
      result = await result.json();
      if (result.status === 0) {
        setShellData(result.responce);
        alert(`Success: ${result.message}`);
      } else {
        setShellData(result.responce);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Server Error.");
    }
  };

  const LinuxConfig = async () => {
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/linuxConfig`,
        {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
          body: JSON.stringify({ devices: ipAddresses }),
        }
      );
      result = await result.json();
      if (result.status === 0) {
        setShellData(result.responce);
        alert(`Success: ${result.message}`);
      } else {
        setShellData(result.responce);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Server Error.");
    }
  };

  return (
    <>
      <Navbar />
      <Header Title="Linux Provisioning" breadcrumb="/Server/5G core" />
      <div className="linux-container">
        <img className="linux-img" src={Core} alt="Loading..." />
        <form className="   linux-provisioning-form">
          {ipAddresses.map((ipAddress, index) => (
            <div className="form-group90" key={index}>
              <label htmlFor={`ipAddress-${index}`}>
                IP Address <span style={{ color: "red" }}>*</span>
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  id={`ipAddress-${index}`}
                  value={ipAddress}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Enter IP address"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="button21"
                    onClick={() => removeIpAddress(index)}
                    style={{ marginLeft: "10px", height: "35px" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="form-group90">
            <button type="button" className="button21" onClick={addIpAddress}>
              + Add IP Address
            </button>
          </div>
          <div className="form-group90">
            <button type="button" className="button21" onClick={RebootCall}>
              Reboot
            </button>
          </div>
          <div className="form-group90">
            <button type="button" className="button21" onClick={LinuxConfig}>
              Configure machine
            </button>
          </div>
        </form>
      </div>
      <Shell shellOutput={shellData} />
    </>
  );
};

export default LinuxProvisioning;
