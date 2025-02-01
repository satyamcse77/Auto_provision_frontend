import React, { useState, useEffect } from "react";
import Navbar from "../Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Dropdown from "react-bootstrap/Dropdown";

export default function PhoneFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [Data, setData] = useState({
    IpAddress: "",
    user: "cn=admin,dc=coraltele,dc=com",
    IpAddressNTP: "",
  });
  const [apiData, setApiData] = useState([]);
  const [apiDataList, setApiDataList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showForm, setShowForm] = useState(0);
  const BaseUrlSpring = "192.168.250.51" || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = "192.168.250.51" || "localhost";
  const PORTTr069 = "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const navigate = useNavigate();
  const [xmlContent, setXmlContent] = useState("");
  const [isValidXml, setIsValidXml] = useState(true);
  const [showXMLForm, setShowXMLForm] = useState(false);
  const [editFileName, setEditFileName] = useState("cfg.xml");
  const [isLoading, setIsLoading] = useState(false);
  const [macChange, setMacChange] = useState("");
  const [macOldChange, setOldMacChange] = useState("");
  const [editingRowId, setEditingRowId] = useState(null);

  const fetchData2 = async () => {
    try {
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/allPhoneFile`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
        console.log(data);
      } else {
        console.error("Failed to fetch files:", response.status);
      }
    } catch (error) {
      console.error("Error fetching file data.");
    }
  };

  const fetchData = async () => {
    try {
      if (!Token) navigate("/");
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

  useEffect(() => {

    const fetchData3 = async () => {
      try {
        const TokenData = JSON.parse(Token);
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/allData`,
          {
            method: "GET",
            headers: {
              Authorization: TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.id - b.id);
        if (sortedData) {
          setApiDataList(sortedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchData3();
    fetchData2();

    const intervalId = setInterval(() => {
      fetchData3();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [
    setApiData,
    BaseUrlSpring,
    PORTSpring,
    Token,
  ]);

  const Submit = async () => {
    setShowForm(0);
    await CallOfUpdateConfig();
  };

  const SaveXMLToBackend = async () => {
    try {
      const TokenData = JSON.parse(Token);
      const formData = new FormData();
      formData.append("file", new Blob([xmlContent], { type: "application/xml" }), editFileName);
      formData.append("fileName", editFileName);
      const response = await fetch(`http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/updateIpFile`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + TokenData.AuthToken,
        },
        body: formData,
      });
      if (response.ok) {
        await response.json();
        alert("File successfully updated. File Name: " + editFileName);
        await fetchData2();
      } else {
        console.error("File update failed. File Name: " + editFileName);
        alert("File update failed.");
      }
    } catch (error) {
      console.error("Error during file upload: " + error.message);
      alert("Error during file upload: " + error.message);
    }
  };

  const handleXmlChange = async (data, fileName) => {
    try {
      const content = await data;
      const decodedXmlContent = await atob(content);
      setXmlContent(decodedXmlContent);
      setShowXMLForm(true);
      setEditFileName(fileName);
      const parser = new XMLParser();
      parser.parse(content);
      setIsValidXml(true);
    } catch (error) {
      console.error("Invalid XML:", error.message);
      setIsValidXml(false);
    }
  };

  const DownloadXmlFile = () => {
    if (!isValidXml) {
      alert("Invalid XML format");
      return;
    }
    const builder = new XMLBuilder();
    const xmlData = builder.build({ root: xmlContent });
    const blob = new Blob([xmlData], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = editFileName;
    link.click();
  };

  const CallOfUpdateConfig = async () => {
    setShowForm(0);
  
    if (selectedFiles.length === 0) {
      alert("At least select one macAddress!");
      return;
    }
  
    setIsLoading(true);
  
    const macAddresses = selectedFiles
      .map((file) => file.replace(/^cfg/, "").replace(/\.xml$/, ""))
      .filter((macAddress) => macAddress !== "sample.cnf");
  
    if (apiDataList.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 20000));
    }
  
    let NotActiveMacAddress = [];
    let NotFoundMacAddress = [];
    let ActiveMacAddress = [];
  
    for (const macAddressToCheck of macAddresses) {
      const foundItem = await new Promise((resolve) => {
        const found = apiDataList.find(item => item.macAddress === macAddressToCheck);
        resolve(found);
      });
  
      if (foundItem) {
        if (foundItem.active) {
          ActiveMacAddress.push(macAddressToCheck);
        } else {
          NotActiveMacAddress.push(macAddressToCheck);
        }
      } else {
        NotFoundMacAddress.push(macAddressToCheck);
      }
    }
  
    const message = `Active devices: [${ActiveMacAddress.join(', ')}], Inactive devices: [${NotActiveMacAddress.join(', ')}], Devices not found or incorrect: [${NotFoundMacAddress.join(', ')}]`;
    const userConfirmed = window.confirm(message);
    if (!userConfirmed) {
      setIsLoading(false);
      return;
    }
  
    try {
      const TokenData = JSON.parse(Token);
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/updateByFile`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ActiveMacAddress),
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        let resultSuccess = [];
        ActiveMacAddress.forEach(macAddress => {
          if (result.messageDetail.includes(macAddress)) {
            resultSuccess.push(macAddress);
          }
        });
        alert(`Provisioning successful. macAddress: ${resultSuccess.join(', ')}`);
      } else {
        const errorResult = await response.json();
        alert("Error response:", errorResult);
      }
    } catch (error) {
      console.error("Error during the update:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const ApplyChanges = async (Call) => {
    try {
      const TokenData = JSON.parse(Token);
      let response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/ApplyChanges`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TokenData.AuthToken,
          },
          body: JSON.stringify({
            ipAddress: Data.IpAddress,
            user: Data.user,
            ipAddressNTP: Data.IpAddressNTP,
            selectedFiles: selectedFiles,
            callOfAPI: Call,
          }),
        }
      );
      const result = await response.json();
      if (result.issue === "OK") {
        alert("Update Successful");
        await fetchData2();
      }
      return { success: result.status === 1 };
    } catch (error) {
      console.error("Error changes in file:", error);
      return { success: false };
    }
  };

  const handleCheckboxChange = (fileName) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter((fileId) => fileId !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFiles([]);
    } else {
      const allFiles = apiData
        .filter((item) => item.fileName !== "cfgSample.xml")
        .map((item) => item.fileName);
      setSelectedFiles(allFiles);
    }
    setSelectAll(!selectAll);
  };

  let serialNumber = 0;

  const closeForm = () => {
    setShowXMLForm(false);
  };

  const SyncConfig = async () => {
    setShowForm(0);
    if (selectedFiles.length === 0) {
      alert("At least select one macAddress!");
      return;
    }
    setIsLoading(true);
    const macAddresses = selectedFiles
      .map((file) => file.replace(/^cfg/, "").replace(/\.xml$/, ""))
      .filter((macAddress) => macAddress !== "sample.cnf");
    try {
      const TokenData = JSON.parse(Token);
      let response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/SyncConfig`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(macAddresses),
        }
      );
      if (response.ok) {
        const result = await response.json();
        alert(`Sync config successful. macAddress: ${result.messageDetail}`);
        window.location.reload();
      } else {
        const errorResult = await response.json();
        alert("Error response:", errorResult);
      }
    } catch (error) {
      console.error("Error during the sync config:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const SyncConfigAll = async () => {
    setShowForm(0);
    if (!window.confirm("Are you sure you want to sync all device configs?")) {
      return;
    }
    setIsLoading(true);
    try {
      const TokenData = JSON.parse(Token);
      let response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/SyncConfigAll`,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + TokenData.AuthToken,
            "Content-Type": "application/json",
          }
        }
      );
      if (response.ok) {
        alert(`Sync all device config successful.`);
        window.location.reload();
      } else {
        const errorResult = await response.json();
        alert("Error response:", errorResult);
      }
    } catch (error) {
      console.error("Error during the sync config:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const MacAddressChange = async (macAddress, serialNumber) => {
    if (editingRowId === serialNumber) {
      setEditingRowId(null);
    } else {
      setEditingRowId(serialNumber);
      setMacChange(macAddress);
      setOldMacChange(macAddress);
    }
  }

  const SaveChangeMacAddress = async () => {
    setEditingRowId(null);
    if (!window.confirm("Are you sure you want to change old mac address: " + macOldChange + " to new mac address: " + macChange)) {
      return;
    }
    const TokenData = JSON.parse(Token);
    try {
      let response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/changeMacAddress`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + TokenData.AuthToken,
            "oldMacAddress": macOldChange,
            "NewMacAddress": macChange,
            "Content-Type": "application/json",
          }
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        await fetchData2();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error changing MAC address:", error);
      alert("An error occurred while changing the MAC address.");
    }
  }

  return (
    <>
      <Navbar />
      <form
        className="history-list"
        style={{ marginLeft: "240px", marginRight: "40px" }}
      >
        <div className="form-group">
          <Dropdown className="phoneDropdownFile">
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="tabItem"
            >
              More setting
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  SyncConfigAll();
                }}
              >
                Sync config all
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setShowForm(2);
                }}
              >
                NTP
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setShowForm(1)}
              >
                LDAP
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="table-container">
            <table className="styled-table2233">
              <thead>
                <tr>
                  <th>Serial no.</th>
                  <th>MacAddress</th>
                  <th>FileName</th>
                  <th>
                    Action{" "}
                    <span className="selectAllButton" onClick={handleSelectAll}>
                      {selectAll ? "Deselect All" : "Select All"}
                    </span>
                  </th>
                  <th>File view</th>
                </tr>
              </thead>
              <tbody>
                {apiData.map((item, index) => {
                  if (item.fileName === "sample.cnf.xml") {
                    return null;
                  }
                  const serialNumber = (index + 1) - 1;
                  return (
                    <tr key={serialNumber}>
                      <td>{serialNumber}</td>
                      <td>
                        {editingRowId === serialNumber ? (
                          <>
                            <input
                              type="text"
                              value={macChange}
                              onChange={(e) => setMacChange(e.target.value)}
                              style={{
                                marginRight: "8px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                width: "150px"
                              }}
                            />
                            <FaSave
                              style={{
                                color: "#28a745",
                                fontSize: "18px",
                                cursor: "pointer",
                                transition: "color 0.3s ease",
                              }}
                              onClick={SaveChangeMacAddress}
                            />
                          </>
                        ) : (
                          item.fileName.replace(/^cfg/, "").replace(/\.xml$/, "")
                        )}

                        <MdEdit
                          style={{
                            marginLeft: "8px",
                            color: "#007bff",
                            fontSize: "18px",
                            cursor: "pointer",
                            transition: "color 0.3s ease",
                          }}
                          onClick={() =>
                            MacAddressChange(
                              item.fileName.replace(/^cfg/, "").replace(/\.xml$/, ""),
                              serialNumber
                            )
                          }
                        />
                      </td>
                      <td>{item.fileName}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(item.fileName)}
                          onChange={() => handleCheckboxChange(item.fileName)}
                        />
                      </td>
                      <td>
                        <FaEdit
                          onClick={() => handleXmlChange(item.fileData, item.fileName)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginBottom: "50px" }}>
            {apiData.length === 0 && (
              <span style={{ color: "red" }}>
                No data present, the folder will be empty or incorrect file
                name.
              </span>
            )}
          </div>
          <div className="twoFileButton" style={{ display: 'flex', marginLeft: '50px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              style={{ width: '300px', height: '50px' }}
              onClick={SyncConfig}
            >
              Sync config
            </button>
            <button
              type="button"
              style={{ height: '50px', width: '300px', marginLeft: "10px" }}
              onClick={Submit}
            >
              Provision all
            </button>
          </div>
        </div>
      </form>
      <div>

        {showForm === 1 && (
          <div className="form-group22">
            <div className="back-icon" onClick={() => setShowForm(0)}>
              <ImCross />
            </div>
            <label htmlFor="ip_address">Enter IP Address:</label>
            <input
              type="text"
              id="ip_address"
              value={Data.IpAddress}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  IpAddress: e.target.value,
                }))
              }
              placeholder="Enter IP address."
            />

            <label htmlFor="username">Enter Username:</label>
            <input
              type="text"
              id="username"
              value={Data.user}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  user: e.target.value,
                }))
              }
              placeholder="Enter Username."
            />
            <button
              type="button"
              className="buttonSmall" style={{marginTop: "10px"}}
              onClick={() => ApplyChanges("1")}
            >
              Submit
            </button>
          </div>
        )}

        {showXMLForm && (
          <div className="overlay">
            <div className="form-container">
              <div className="button-container">
                <button
                  onClick={DownloadXmlFile}
                  disabled={!isValidXml}
                  className="button"
                >
                  Download XML
                </button>
                <button onClick={SaveXMLToBackend} className="button">
                  Save XML
                </button>
                <button onClick={closeForm} className="button">
                  Close
                </button>
              </div>
              <textarea
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                rows={20}
                cols={50}
                className="textarea"
              />
              {!isValidXml && <p className="error-text">Invalid XML</p>}
            </div>
          </div>
        )}

        {showForm === 2 && (
          <div className="form-group22">
            <div className="back-icon" onClick={() => setShowForm(0)}>
              <ImCross />
            </div>
            <label htmlFor="ip_address">Enter IP Address.</label>
            <input
              type="text"
              id="ip_address"
              value={Data.IpAddressNTP}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  IpAddressNTP: e.target.value,
                }))
              }
              placeholder="Enter ip address."
            />
            <button
              type="submit"
              className="buttonSmall" style={{marginTop: "10px"}}
              onClick={() => ApplyChanges("2")}
            >
              Submit
            </button>
          </div>
        )}

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
              Please wait... while we are provisioning device.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
