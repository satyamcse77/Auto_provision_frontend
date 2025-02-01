import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "./cards/header";
import Tabs from "./cards/Tabs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Dropdown from "react-bootstrap/Dropdown";
import { MdOnlinePrediction } from "react-icons/md";

export default function TimeSchedule() {

  const navigate = useNavigate();

  const [AllMacAddress, setAllMacAddress] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Single time schedule");
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const BaseUrlSpring = window.location.host.split(":")[0] || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [currectApiData, setCurrectApiData] = useState([]);
  const [macAddress, setMacAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fileType, setFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [phoneSelect, setPhoneSelect] = useState("All device");

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (!Token) navigate("/");
        const TokenData = JSON.parse(Token);
        const response = await fetch(`http://${BaseUrlTr069}:${PORTTr069}/checkAuth`, {
          method: "post",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        });
        const data = await response.json();
        if (data.status !== 1) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchData2 = async () => {
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
        const sortedData = await data.sort((a, b) => a.id - b.id);
        if (sortedData) {
          setApiData(sortedData);
          if (phoneSelect === "All device") {
            setCurrectApiData(sortedData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchData2();

    const intervalId = setInterval(() => {
      fetchData2();
    }, 10000);

    return () => clearInterval(intervalId);

  }, [setApiData,
    BaseUrlSpring,
    PORTSpring,
    Token,]);

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    let formData = new FormData();
    formData.append("file", selectedFile);

    const currentDate = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    if (selectedDateTime < currentDate) {
      alert("Please select an upcoming or current date and time.");
      return;
    }
    const day = new Date(date).getDate().toString().padStart(2, "0");
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, "0");
    const year = new Date(date).getFullYear();
    const Correctdate = `${day}/${month}/${year}`;
    try {
      let response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/addFileAutoDeploy/${macAddress}`,
        {
          method: "put",
          body: formData,
          headers: {
            time: time,
            Filetype: fileType,
            Authorization: Token,
            dateoffile: Correctdate,
          },
        }
      );
      let result = await response.json();
      console.log(result);
      if (result.status === 0) {
        alert("File added successfully");
      } else {
        alert("File add to auto deploy failed.");
      }
    } catch (error) {
      alert("Server error, please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (macAddress) => {
    if (AllMacAddress.includes(macAddress)) {
      setAllMacAddress(AllMacAddress.filter((fileId) => fileId !== macAddress));
    } else {
      setAllMacAddress([...AllMacAddress, macAddress]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setAllMacAddress([]);
    } else {
      const allFiles = currectApiData
        .map((item) => item.macAddress);
      setAllMacAddress(allFiles);
    }
    setSelectAll(!selectAll);
  };

  const handleBulkFireware = async () => {
    try {
      const currentDate = new Date();
      const selectedDateTime = new Date(`${date}T${time}`);
      if (!date || !time) {
        alert("Date and time are required.");
        return;
      }
      else if (selectedDateTime < currentDate) {
        alert("Please select an upcoming or current date and time.");
        return;
      } else if (!selectedFile) {
        alert("File is required.");
        return;
      }
      const day = new Date(date).getDate().toString().padStart(2, "0");
      const month = (new Date(date).getMonth() + 1).toString().padStart(2, "0");
      const year = new Date(date).getFullYear();
      const Correctdate = `${day}/${month}/${year}`;
      setIsLoading(true);
      const TokenData = JSON.parse(Token);
      let formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("macAddresses", AllMacAddress.join(","));
      formData.append("extensionName", "rom");
      formData.append("time", time);
      formData.append("date", Correctdate);
      let response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/FirewareBulkUpdateAndUpload`,
        {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " + TokenData.AuthToken,
          },
          body: formData
        }
      );
      if (response.ok) {
        const result = await response.json();
        alert(`Fireware bulk schedule successful macAddress: ${result.messageDetail}`);
      } else {
        const errorResult = await response.json();
        alert("Error response:", errorResult);
      }
    } catch (error) {
      console.error("Error during the fireware bulk schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const FilterData = (phoneSelectData) => {
    let filteredData = [];
    if (phoneSelectData === "IP2LG") {
      filteredData = apiData.filter(item => item.productClass === "IP2LG");
    } else if (phoneSelectData === "IP2LP") {
      filteredData = apiData.filter(item => item.productClass === "IP2LP");
    } else if (phoneSelectData === "IP4LP") {
      filteredData = apiData.filter(item => item.productClass === "IP4LP");
    } else if (phoneSelectData !== "IP2LG" && phoneSelectData !== "IP2LP" && phoneSelectData !== "IP4LP" && phoneSelectData !== "All device") {
      filteredData = apiData.filter(item =>
        item.productClass !== "IP2LG" &&
        item.productClass !== "IP2LP" &&
        item.productClass !== "IP4LP"
      );
    } else {
      filteredData = apiData;
    }
    setCurrectApiData(filteredData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bulk firmware schedule":
        return (
          <>
            <div>
              <form
                style={{ marginLeft: "240px" }}
              >
                <div className="form-group">
                  <Dropdown className="phoneDropdown">
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="tabItem"
                    >
                      {phoneSelect}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setPhoneSelect("IP2LG");
                          FilterData("IP2LG");
                        }}
                      >
                        IP2LG
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setPhoneSelect("IP2LP");
                          FilterData("IP2LP");
                        }}
                      >
                        IP2LP
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setPhoneSelect("IP4LP");
                          FilterData("IP4LP");
                        }}
                      >
                        IP4LP
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setPhoneSelect("IP6LP");
                          FilterData("IP6LP");
                        }}
                      >
                        IP6LP
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setPhoneSelect("All device");
                          FilterData("All device");
                        }}
                      >
                        All device
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <div className="table-container">
                    <table className="styled-table2233">
                      <thead>
                        <tr>
                          <th>Serial no.</th>
                          <th>MacAddress</th>
                          <th>Product class</th>
                          <th>IP Address</th>
                          <th>Status</th>
                          <th>
                            Action{" "}
                            <span className="selectAllButton" onClick={handleSelectAll}>
                              {selectAll ? "Deselect All" : "Select All"}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currectApiData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.macAddress}
                            </td>
                            <td>{item.productClass}</td>
                            <td>
                              {item.ipAddress ? item.ipAddress : ""}
                            </td>
                            <td>
                              <MdOnlinePrediction
                                icon={MdOnlinePrediction}
                                style={{
                                  cursor: "pointer",
                                  color: item.active ? "green" : "red",
                                  marginLeft: "10px",
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={AllMacAddress.includes(item.macAddress)}
                                onChange={() => handleCheckboxChange(item.macAddress)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <div className="form-group90">
                      <label htmlFor="date">Date:</label>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group90">
                      <label htmlFor="time">Time:</label>
                      <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                    <label htmlFor="file">Upload File:</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        required
                      />
                      <button type="button" className="button21" onClick={handleBulkFireware}>
                        Schedule all
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        );
      case "Single time schedule":
        return (
          <div className="content-container">
            <form className="Textlight21" onSubmit={handleFileUpload}>
              <div className="form-group90">
                <label htmlFor="macAddress">
                  MAC Address<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  id="macAddress"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  placeholder="Enter MAC address"
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="time">Time:</label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label>File type:</label>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="configuration"
                    name="fileType"
                    value="configuration"
                    checked={fileType === "configuration"}
                    onChange={handleFileTypeChange}
                  />
                  <label htmlFor="configuration">Vendor Configuration File</label>
                  <input
                    type="radio"
                    id="firmware"
                    name="fileType"
                    value="firmware"
                    checked={fileType === "firmware"}
                    onChange={handleFileTypeChange}
                  />
                  <label htmlFor="firmware">Firmware Upgrade Images</label>
                </div>
              </div>

              <div className="form-group90">
                <label htmlFor="file">Upload File:</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    required
                  />
                  <button type="submit" className="button21">
                    Upload
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
      <Header
        Title='Auto Scheduling'
        breadcrumb='/Scheduling/Auto Scheduling' />

      <div className="tabs-container">
        <Tabs
          tabs={["Single time schedule", "Bulk firmware schedule"]}
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
}

