import React, { useEffect, useState } from "react";
import Navbar from "../../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../../cards/header";
import Shell from "../../terminal";

export default function CallServer() {
  const navigate = useNavigate();
  const [shellData, setShellData] = useState(
    "Welcome to linux Shell! This is a read-only shell."
  );
  const [ipAddresses, setIpAddresses] = useState([]);
  const BaseUrlTr069 = "192.168.250.51" || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlNode = "192.168.250.51" || "localhost";
  const PORTNode = process.env.REACT_APP_API_NODE_PORT || "4058";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);

  useEffect(() => {
    if (!Token) navigate("/");
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
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (provision) => {
    if (provision === 1) {
      const confirmSubmit = window.confirm("Are you sure you want to submit to all ansible IP addresses?");
      if (!confirmSubmit) {
        return;
      }
    }
    if (provision === 0 && ipAddresses.length === 0) {
      alert("Enter at least one IP Address.");
      return;
    }
    try {
      setShellData("Loading...");
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlNode}:${PORTNode}/sendFile`,
        {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            provision: provision,
            devices: JSON.stringify(ipAddresses),
          },
        }
      );
      const data = await response.json();
      if (data.status === 0) {
        const formattedResponses = data.responses.map(item => ({
          ipAddress: item.IpAddress.ipAddress,
          result: item.result.responce
        }));
        setShellData(JSON.stringify(formattedResponses, null, 2));
      }
    } catch (error) {
      console.error("Error fetching data.");
      setShellData("Internal server error.");
    }
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

  const handleSubmit = (e, provision) => {
    e.preventDefault();
    handleFileUpload(provision);
  };

  return (
    <>
      <Navbar />
      <Header Title="Call Server" breadcrumb="/Servers/CallServer" />
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
                  onChange={(e) =>
                    handleInputChange(index, e.target.value)
                  }
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
            style={{ marginBottom: "40px", marginTop: "40px" }}
          >
            Send only IP Address
          </button>
          <button
            type="button"
            className="button21"
            onClick={(e) => handleSubmit(e, 1)}
          >
            Send to All
          </button>
        </form>
      </div>
      <Shell shellOutput={shellData} />
    </>
  );
}
