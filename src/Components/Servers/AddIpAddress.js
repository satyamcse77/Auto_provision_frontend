import React, { useEffect, useState } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../cards/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AddIpAddress() {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [deleteNumber, setDeleteNumber] = useState(-1);
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const BaseUrlNode = process.env.REACT_APP_API_NODE_URL || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "3000";
  const Token = Cookies.get(CookieName);

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

  const handleFileUpload = async (provision) => {
    if (ipAddresses.length === 0) {
      alert("Enter at least one IP Address.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/addIPAddress`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provision: provision,
            devices: ipAddresses,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        alert("IP Address successfully added.");
      } else {
        alert("Failed to add IP Address.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to add IP Address.");
    }
  };

  const handleSubmit = (e, provision) => {
    e.preventDefault();
    handleFileUpload(provision);
  };

  const addIpAddress = () => {
    setIpAddresses([...ipAddresses, { ipAddress: "" }]);
  };

  const handleInputChange = (index, value) => {
    const newIpAddresses = [...ipAddresses];
    newIpAddresses[index] = { ipAddress: value };
    setIpAddresses(newIpAddresses);
  };

  const removeIpAddress = (index) => {
    const newIpAddresses = ipAddresses.filter((_, i) => i !== index);
    setIpAddresses(newIpAddresses);
  };

  const handleDelete = async (ipAddress) => {
    try {
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/addIPAddress/delete`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provision: deleteNumber,
            devices: ipAddress,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleList = async (provision) => {
    try {
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/getIpAddress`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
            provision: provision,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 0) {
        setDeleteNumber(provision);
        setApiData(data.ips);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Header
        Title="Add IPAddress to server"
        breadcrumb="/Servers/Add IPAddress to server"
      />
      <div className="content-container">
        <form
          className="black-box"
          style={{ marginLeft: "450px" }}
          onSubmit={(e) => handleSubmit(e, 0)}
        >
          <button type="button" className="button21" onClick={addIpAddress}>
            Add IPAddress +
          </button>
          {ipAddresses.map((item, index) => (
            <div className="form-group90" key={index}>
              <label htmlFor={`ipAddress-${index}`}>
                Enter IP Address {index + 1}
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  id={`ipAddress-${index}`}
                  value={item.ipAddress}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Enter IP address"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="button21"
                    onClick={() => removeIpAddress(index)}
                    style={{ marginLeft: "10px", height: "50px" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="button21"
            onClick={(e) => handleSubmit(e, 0)}
            style={{ marginBottom: "40px", marginTop: "40px" }}
          >
            Add IpAddress to reboot
          </button>
          <button
            type="button"
            className="button21"
            onClick={(e) => handleSubmit(e, 1)}
            style={{ marginBottom: "40px" }}
          >
            Add IpAddress to configure linux
          </button>
          <button
            type="button"
            className="button21"
            onClick={(e) => handleSubmit(e, 2)}
          >
            Add IpAddress to call server
          </button>
        </form>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => handleList(0)}>Reboot ip list</button>
        <button onClick={() => handleList(1)}>Configure ip list</button>
        <button onClick={() => handleList(2)}>Call server ip list</button>
        <button onClick={() => handleList(3)}>Group list</button>
      </div>

      <form
        className="callServer-list"
        style={{ marginLeft: "240px", marginRight: "40px" }}
      >
        <div className="form-group902232">
          <table className="styled-table2232">
            <thead>
              <tr>
                <th>Serial no.</th>
                <th>IpAddress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={() => handleDelete(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
