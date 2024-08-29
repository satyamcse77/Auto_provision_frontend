import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "./cards/header";

export default function TimeSchedule() {

  const navigate = useNavigate();
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
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
  }, [navigate, BaseUrlTr069, PORTTr069, Token]);

  const [macAddress, setMacAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fileType, setFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
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
    }
  };

  return (
    <>
      <Navbar />
      <Header 
      Title='Auto Scheduling'
      breadcrumb ='/Scheduling/Auto Scheduling'/>
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
    </>
  );
}