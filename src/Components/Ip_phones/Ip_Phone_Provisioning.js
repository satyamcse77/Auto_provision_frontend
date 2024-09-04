import React, { useEffect, useState } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Header from "../cards/header";
import Sipserver from "../Ip_phones/Sipserver";
import Tabs from '../cards/Tabs'


const IpPhoneProvisioning = () => {
  
  const [MacAddress, setMacAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
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
  }, [navigate, PORTTr069, BaseUrlTr069, Token]);

  const RebootCall = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/reboot/${MacAddress}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert("Device rebooted - " + MacAddress);
      } else {
        alert("MacAddress wrong or invalid token.");
      }
    } catch (error) {
      alert("Server error, please try again.");
      console.error(error);
    }
  };

  const ResetCall = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/reset/${MacAddress}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        }
      );
      result = await result.json();
      console.log(result);
      if (result.status === 0) {
        alert("Device reset - " + MacAddress);
      } else {
        alert("MacAddress wrong or invalid token.");
      }
    } catch (error) {
      alert("Server error, please try again.");
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const CallOfUploadConfig = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    } else if (selectedFile == null) {
      alert("Select configuration file.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      let formData = new FormData();
      formData.append("file", selectedFile);
      const fileExtension = selectedFile.name.split(".").pop();
      const fileName = `cfg${MacAddress}.${fileExtension}`;
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/uploadConfig/${MacAddress}`,
        {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            fileName: fileName,
          },
          body: formData,
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert(`Configuration file uploaded successfully for ${MacAddress}`);
      } else {
        alert("Failed to upload configuration file. Error: " + result.message);
      }
    } catch (error) {
      alert("Error uploading configuration file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };

  const CallOfUpdateConfig = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/updateConfig/${MacAddress}`,
        {
          method: "get",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert(`Configuration file update successfully for ${MacAddress}`);
      } else {
        alert("Failed to update configuration file. Error: " + result.message);
      }
    } catch (error) {
      alert("Error updating configuration file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const CallOfUploadFirmware = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    } else if (selectedFile == null) {
      alert("Select firmware file.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      let formData = new FormData();
      formData.append("file", selectedFile);
      const fileExtension = selectedFile.name.split(".").pop();
      const extensionName = `${fileExtension}`;
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/uploadFirmware/${MacAddress}`,
        {
          method: "put",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            extensionName: extensionName,
          },
          body: formData,
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert(`Firmware file uploaded successfully for ${MacAddress}`);
      } else {
        alert("Failed to upload firmware file. Error: " + result.message);
      }
    } catch (error) {
      alert("Error uploading firmware file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };

  const CallOfUpdateFirmware = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    }
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/updateFirmware/${MacAddress}`,
        {
          method: "get",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert(`Firmware file update successfully for ${MacAddress}`);
      } else {
        alert("Failed to update firmware file. Error: " + result.message);
      }
    } catch (error) {
      alert("Error updating firmware file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("Account Settings"); 

  const renderTabContent = () => {
    switch (activeTab) {
      case "Account Settings":
        return (
          <>
            <Sipserver />
          </>
        );
      case "Provisioning":
        return (
          <div className="">
            <form
              className="ip-phone-form"
              style={{ marginBottom: "50px" }}
              onSubmit={handleSubmit}
            >
              <h3>IP Phone</h3>
              <div className="Form-ip-provisioning">
                <input
                  type="text"
                  id="MacAddress"
                  className="ip-mac-input"
                  value={MacAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  placeholder="Enter MacAddress."
                  required
                />

                <div className="btn-group">
                  <button type="button" onClick={RebootCall} className="button">
                    Reboot
                  </button>
                  <button type="button" onClick={ResetCall} className="button">
                    Reset
                  </button>
                </div>
              </div>

              <hr className="config-hr" />
              <div className="config-section">
                <h5>Vendor Configuration File</h5>
                <br />
                  <Form.Group controlId="formFileDisabled" className="mb-3">
                    <Form.Control type="file" onChange={handleFileChange} />
                    {selectedFile && <p>{selectedFile.name}</p>}
                  </Form.Group>
                <div className="Form-ip-provisioning">

                  <button
                    type="button"
                    className="button"
                    onClick={CallOfUploadConfig}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={CallOfUpdateConfig}
                  >
                    Update
                  </button>
                </div>
              </div>
              <hr className="config-hr" />
              <div className="config-section">
                <h5>Firmware Upgrade</h5>
                <br />
                <Form.Group controlId="formFileDisabled" className="mb-3">
                  <Form.Control type="file" onChange={handleFileChange} />
                  {selectedFile && <p>{selectedFile.name}</p>}
                </Form.Group>
                <div className="Form-ip-provisioning">

                  <button
                    type="button"
                    className="button"
                    onClick={CallOfUploadFirmware}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={CallOfUpdateFirmware}
                  >
                    Update
                  </button>
                </div>
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
      <Header Title="IP Phones Provisioning" breadcrumb="/IP phone/IP2LG" />
      <div className="tabs-container">
        <Tabs
          tabs={["Account Settings", "Provisioning"]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      {renderTabContent()}
    </>
  );
};

export default IpPhoneProvisioning;
