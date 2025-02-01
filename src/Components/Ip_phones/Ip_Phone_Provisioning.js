import React, { useEffect, useState } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Header from "../cards/header";
import Sipserver from "../Ip_phones/Sipserver";
import Tabs from "../cards/Tabs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const IpPhoneProvisioning = () => {
  const [activeTab, setActiveTab] = useState("Account Settings");
  const [AddMacAddress, setAddMacAddress] = useState([]);
  const [MacAddress, setMacAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const BaseUrlSpring = window.location.host.split(":")[0] || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const [isLoading, setIsLoading] = useState(false);

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

  const RebootCall = async () => {
    if (MacAddress !== "") {
      AddMacAddress.push({ MacAddress: MacAddress });
    }
    if (AddMacAddress.length === 0) {
      alert("At least one MAC address is required.");
      return;
    }
    setIsLoading(true);
    const FormatedDataAddMacAddress = await AddMacAddress.map(
      (item) => item.MacAddress
    );
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/rebootBulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TokenData.AuthToken,
          },
          body: JSON.stringify(FormatedDataAddMacAddress),
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert("Devices rebooted successfully.");
      } else {
        alert("Failed to reboot devices.");
      }
    } catch (error) {
      alert("Server error, please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ResetCall = async () => {
    const confirmed = window.confirm("Are you sure you want to reset your phone?");
    if (!confirmed) {
      return;
    }
    if (MacAddress !== "") {
      AddMacAddress.push({ MacAddress: MacAddress });
    }
    if (AddMacAddress.length === 0) {
      alert("At least one MAC address is required.");
      return;
    }
    setIsLoading(true);
    const FormatedDataAddMacAddress = await AddMacAddress.map(
      (item) => item.MacAddress
    );
    console.log(FormatedDataAddMacAddress);
    try {
      const TokenData = JSON.parse(Token);
      let result = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/resetBulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TokenData.AuthToken,
          },
          body: JSON.stringify(FormatedDataAddMacAddress),
        }
      );
      result = await result.json();
      if (result.status === 0) {
        alert("Devices reset successfully.");
      } else {
        alert("Failed to reset devices.");
      }
    } catch (error) {
      alert("Server error, please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const CallOfUpdateConfig = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    }
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const CallOfUpdateFirmware = async () => {
    if (MacAddress === "") {
      alert("MacAddress is required.");
      return;
    }
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const addIpAddress = () => {
    setAddMacAddress([...AddMacAddress, { MacAddress: "" }]);
  };

  const handleInputChange = (index, value) => {
    const newAddMacAddress = [...AddMacAddress];
    newAddMacAddress[index] = { MacAddress: value };
    setAddMacAddress(newAddMacAddress);
  };

  const removeAddMacAddress = (index) => {
    const newAddMacAddress = AddMacAddress.filter((_, i) => i !== index);
    setAddMacAddress(newAddMacAddress);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Account Settings":
        return (
          <>
            <Sipserver />
          </>
        );
      case "Manage device":
        return (
          <div className="ip-phone-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: "30px",
            }}
          >
            <div className="ip-phone-container">
              <form
                className="ip-phone-form"
                style={{ marginBottom: "50px" }}
                onSubmit={handleSubmit}
              >
                <div className="black-boxinner" style={{ width: "655px" }}>
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
                      <button
                        type="button"
                        style={{ fontSize: "11px" }}
                        className="button"
                        onClick={addIpAddress}
                      >
                        Add Mac Address +
                      </button>
                    </div>
                  </div>

                  {AddMacAddress.map((item, index) => (
                    <div className="addMacForm" key={index}>
                      <label htmlFor={`MacAddress-${index}`}>
                        Enter Mac Address {index + 2}
                      </label>
                      <div className="addMacAddress">
                        <input
                          type="text"
                          id={`MacAddress-${index}`}
                          value={item.ipAddress}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          placeholder="Enter Mac address"
                          required
                        />
                        {index > -1 && (
                          <button
                            type="button"
                            onClick={() => removeAddMacAddress(index)}
                            style={{ marginLeft: "10px" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}</div>

                <hr className="config-hr" />
                <div className="config-section">
                  <p style={{ color: "red" }}>
                    Note: vendor configuration file and Firmware Upgrade currently
                    can not support bulk provision it will take only 1st
                    macAddress
                  </p>
                  <div className="black-boxinner" style={{ width: "655px" }}>
                    <h5>Vendor Configuration File</h5>
                    <br />
                    <div className="Form-ip-provisioning">
                      <Form.Group controlId="formFileDisabled" className="mb-3">
                        <Form.Control type="file" onChange={handleFileChange} />
                        {selectedFile && <p>{selectedFile.name}</p>}
                      </Form.Group>

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
                  </div></div>
                <div className="black-boxinner" style={{ width: "655px" }}>
                  <hr className="config-hr" />
                  <div className="config-section">
                    <h5>Firmware Upgrade</h5>
                    <br />
                    <div className="Form-ip-provisioning">
                      <Form.Group controlId="formFileDisabled" className="mb-3">
                        <Form.Control type="file" onChange={handleFileChange} />
                        {selectedFile && <p>{selectedFile.name}</p>}
                      </Form.Group>

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
                </div>
              </form>
            </div>
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
          tabs={["Account Settings", "Manage device"]}
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
            Please wait... while we are retrieving the data.
          </div>
        </div>
      )}
    </>
  );
};

export default IpPhoneProvisioning;
