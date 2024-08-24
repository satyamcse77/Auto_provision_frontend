import React, { useEffect, useState } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import Header from "../cards/header";
import { useNavigate } from "react-router-dom";
import Cisco from "../Image/cisco.png";
import Tabs from "../cards/Tabs";
import { BiArrowFromLeft } from "react-icons/bi";
import { FaCircle, FaRegCircle, FaTimes } from "react-icons/fa";

const Cisco_phone = () => {

  const [progressOpen, setProgressOpen] = useState(false);
  const [dhcp, setDhcp] = useState(true);
  const [defaultFile, setDefaultFile] = useState(true);
  const [tftp, setTftp] = useState(true);
  const [path, setPath] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [securePort, setSecurePort] = useState("");
  const [totalSteps, setTotalSteps] = useState(null);
  const [macAddress, setMacAddress] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [account1_Extension, setAccount1_Extension] = useState("");
  const [account1_AuthenticateID, setAccount1_AuthenticateID] = useState("");
  const [account1_LocalSipPort, setAccount1_LocalSipPort] = useState("");
  const [sipServer, setSipServer] = useState("");
  const [activeTab, setActiveTab] = useState("Provisioning");
  const [macAddresses, setMacAddresses] = useState([{ macAddress: "", Extension: "" },]);
  const Token = Cookies.get(process.env.REACT_APP_COOKIENAME || "session");
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const navigate = useNavigate();

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

    const fetchData2 = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerCiscoHistory/alldata`,
          {
            method: "get",
            headers: {
              Authorization: "Bearer " + TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const interval1 = setInterval(() => {
      fetchData2();
      fetchData();
    }, 5000); 
    const interval2 = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % totalSteps);
    }, 2000);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [
    navigate,
    PORTTr069,
    BaseUrlTr069,
    Token,
    BaseUrlSpring,
    PORTSpring,
    setHistoryData,
    totalSteps
  ]);

  const percentage = (currentStep / (totalSteps - 1)) * 100;

  const conditions = {
    0: dhcp ? "Dhcp on" :"Dhcp off",
    1: tftp ? "Tftp on" :"Tftp off",
    2: path ? "File present" :"File not present",
    3: defaultFile ? "Default file present" :"Default file not present",
  };

  const getDiagnosis = async (itemData) => {
    const item = itemData;
    console.log(item);
    setDhcp(item.dhcp);
    setTftp(item.tftp);
    setPath(item.filePresent);
    setDefaultFile(item.defaultFile);
    await setTotalSteps(Object.keys(conditions).length);
    setProgressOpen(true);
  };

  const CloseRightPopUp = ()=> {
    setProgressOpen(false);
  }

  const CallSubmit = async (event) => {
    event.preventDefault();
    try {
      const TokenData = JSON.parse(Token);
      const postData = {
        sipServer: sipServer,
        macAddress: macAddress,
        AuthenticateID: account1_AuthenticateID,
        port: account1_LocalSipPort,
        extension: account1_Extension,
        securePort: securePort,
        macAddressBulk: macAddresses.map((item) => item.macAddress),
        macExtensionBulk: macAddresses.map((item) => item.Extension),
      };
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerCiscoHistory/ciscoConfig`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TokenData.AuthToken}`,
          },
          body: JSON.stringify(postData),
        }
      );
      if (!response.ok) {
        alert("Failed to create account.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedMacAddresses = [...macAddresses];
    updatedMacAddresses[index] = {
      ...updatedMacAddresses[index],
      [field]: value,
    };
    setMacAddresses(updatedMacAddresses);
  };

  const removeMacAddress = (index) => {
    const updatedMacAddresses = macAddresses.filter((_, i) => i !== index);
    setMacAddresses(updatedMacAddresses);
  };

  const addMacAddress = () => {
    setMacAddresses([...macAddresses, { macAddress: "", Extension: "" }]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Diagnosis":
        return (
          <>
            <div>
              <form
                className="history-list"
                style={{ marginLeft: "240px", marginRight: "40px" }}
              >
                <div className="form-group902232">
                  <table className="styled-table2232">
                    <thead>
                      <tr>
                        <th>Serial no.</th>
                        <th>MAC address</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.macAddress}</td>
                          <td>{item.date}</td>
                          <td>{item.time}</td>
                          <td>
                            <BiArrowFromLeft
                              style={{
                                cursor: "pointer",
                                color: "blue",
                                marginLeft: "10px",
                              }}
                              onClick={() => getDiagnosis(item)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
            <div>
              {progressOpen && (
                <div
                  className={`progress-sidebar ${progressOpen ? "active" : ""}`}
                  ref={null}
                >
                  <div className="progress-container">
                    <div className="progress-container">
                      <div className="close-icon" onClick={CloseRightPopUp}>
                        <FaTimes />
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-indicator"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="steps">
                        {Object.keys(conditions).map((index) => (
                          <div key={index} className="step">
                            <span className="icon">
                              {index <= currentStep ? (
                                <FaCircle className="icon-completed" />
                              ) : (
                                <FaRegCircle className="icon-incomplete" />
                              )}
                            </span>
                            <span
                              className={`step-label ${
                                index <= currentStep ? "completed" : ""
                              }`}
                            >
                              {conditions[index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      case "Provisioning":
        return (
          <div>
            <form
              className="SipServerForm"
              style={{ marginBottom: "50px" }}
              onSubmit={CallSubmit}
            >
              <div style={{ display: "flex" }} className="form-partition">
                <div className="form-group90">
                  <img
                    style={{ height: "250px", width: "240px" }}
                    src={Cisco}
                    alt="Cisco Phone"
                  />
                </div>
                <div className="form-group90">
                  <label htmlFor="macAddress">
                    Mac Address<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="macAddress"
                    value={macAddress}
                    onChange={(e) => setMacAddress(e.target.value)}
                    placeholder="Enter MAC address"
                    required
                  />
                  <div className="form-group90">
                    <label htmlFor="Sip_server_ip">
                      SIP Server IP<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="Sip_server_ip"
                      value={sipServer}
                      onChange={(e) => setSipServer(e.target.value)}
                      placeholder="Enter SIP server IP"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-accounts-container">
                <div className="form-partition">
                  <div className="black-box">
                    <div className="form-group90">
                      <label htmlFor="account1_LocalSipPort">SIP Port:</label>
                      <input
                        type="number"
                        id="account1_LocalSipPort"
                        value={account1_LocalSipPort}
                        onChange={(e) =>
                          setAccount1_LocalSipPort(e.target.value)
                        }
                        placeholder="Enter SIP port"
                        required
                      />
                    </div>
                    <div className="form-group90">
                      <label htmlFor="securePort">Secure SIP Port:</label>
                      <input
                        type="number"
                        id="securePort"
                        value={securePort}
                        onChange={(e) => setSecurePort(e.target.value)}
                        placeholder="Enter secure SIP port"
                        required
                      />
                    </div>
                    <div className="form-group90">
                      <label htmlFor="account1_Extension">
                        Extension Number:
                      </label>
                      <input
                        type="number"
                        id="account1_Extension"
                        value={account1_Extension}
                        onChange={(e) => setAccount1_Extension(e.target.value)}
                        placeholder="Enter Extension Number"
                        required
                      />
                    </div>
                    <div className="form-group90">
                      <label htmlFor="account1_AuthenticateID">Password:</label>
                      <input
                        type="password"
                        id="account1_AuthenticateID"
                        value={account1_AuthenticateID}
                        onChange={(e) =>
                          setAccount1_AuthenticateID(e.target.value)
                        }
                        placeholder="Enter Password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group90">
                <button type="submit" className="button21">
                  Provision
                </button>
                <button
                  type="button"
                  className="button21"
                  onClick={addMacAddress}
                >
                  Add +
                </button>
                {macAddresses.map((item, index) => (
                  <div className="form-group90" key={index}>
                    <label htmlFor={`macAddress-${index}`}>
                      Enter macAddress and extension of device {index + 2}
                    </label>
                    <div style={{ display: "flex" }}>
                      <input
                        type="text"
                        id={`macAddress-${index}`}
                        value={item.macAddress}
                        onChange={(e) =>
                          handleInputChange(index, "macAddress", e.target.value)
                        }
                        placeholder="Enter MAC address"
                        required
                      />
                      <input
                        type="number"
                        id={`Extension-${index}`}
                        value={item.port}
                        onChange={(e) =>
                          handleInputChange(index, "Extension", e.target.value)
                        }
                        placeholder="Enter extension"
                        required
                      />
                      {index > -1 && (
                        <button
                          type="button"
                          className="button21"
                          onClick={() => removeMacAddress(index)}
                          style={{ marginLeft: "10px", height: "50px" }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <>
      <Navbar />
      <Header Title="Cisco cp-3905" breadcrumb="/IP phone/Cisco cp-3905" />
      <div className="tabs-container">
        <Tabs
          tabs={["Provisioning", "Diagnosis"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {renderTabContent()}
    </>
  );
};

export default Cisco_phone;
