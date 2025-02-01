import React, { useEffect, useState } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from './cards/header'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AutoUpdate() {

  const [apiData, setApiData] = useState([]);
  const [apiFailData, setFailApiData] = useState([]);
  const BaseUrlSpring = window.location.host.split(":")[0] || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const navigate = useNavigate();
  const Token = Cookies.get(CookieName);
  const [isLoading, setIsLoading] = useState(true);

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

    fetchData();

    const fetchData2 = async () => {
      try {
        
        const response = await fetch(
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerAutoDeploy/allAutoDeployData`,
          {
            method: "GET",
            headers: {
              Authorization: Token,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const currentDate = new Date();

        const filteredData = data.filter(item => {
          const [day, month, year] = item.date.split('/');
          const [hour, minute] = item.time.split(':');
          const itemDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
          const twentyFourHoursAgo = new Date(currentDate.getTime());
          return itemDate < twentyFourHoursAgo;
        });

        setFailApiData(filteredData);
        setApiData(data.filter(item => !filteredData.includes(item)));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData2();
  }, []);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerAutoDeploy/deleteAutoDeployData/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Token,
        },
      });
      if (response.ok) {
        alert(`Item with ID ${id} deleted successfully.`);
        window.location.reload();
      } else {
        alert(`Failed to delete item with ID ${id}.`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerAutoDeploy/AutoDeployData/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Token,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch file with ID ${id}.`);
      }
      const data = await response.json();
      const fileName = data.fileName;
      const fileData = data.files;
      const blob = new Blob([fileData], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error fetching or downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <>
      <Navbar style={{ width: "240px" }} />
      <Header
        Title='Auto Update List'
        breadcrumb='/Scheduling/Auto Update List' />
      <div className="autoScheduleList">
        <div className="successfullList">
          <h3>Successful Auto Provisioning List</h3>
          <table className="styled-table2232">
            <thead>
              <tr>
                <th>Serial no.</th>
                <th>Date</th>
                <th>Time</th>
                <th>File type</th>
                <th>MAC address</th>
                <th>File name</th>
                <th>Product class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.fileFormat}</td>
                  <td>{item.macAddress}</td>
                  <td>{item.fileName}</td>
                  <td>{item.productClass}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={() => handleDownload(item.id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginBottom: "50px" }}>
            {apiData.length === 0 && (
              <span style={{ color: "red" }}>
                No data present, the table will be empty.
              </span>
            )}
          </div>
        </div>

        <div className="failList">
          <h3>Failed Auto Provisioning List</h3>
          <table className="styled-table2232">
            <thead>
              <tr>
                <th>Serial no.</th>
                <th>Date</th>
                <th>Time</th>
                <th>File type</th>
                <th>MAC address</th>
                <th>File name</th>
                <th>Product class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiFailData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.fileFormat}</td>
                  <td>{item.macAddress}</td>
                  <td>{item.fileName}</td>
                  <td>{item.productClass}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={() => handleDownload(item.id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginBottom: "50px" }}>
            {apiFailData.length === 0 && (
              <span style={{ color: "red" }}>
                No data present, the table will be empty.
              </span>
            )}
          </div>
        </div>
      </div>

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
            Please wait... while we are saving the data.
          </div>
        </div>
      )}
    </>
  );
}
