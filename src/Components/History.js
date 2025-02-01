import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "./cards/header";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function History() {
  const [apiData, setApiData] = useState([]);
  const BaseUrlSpring = "192.168.250.51" || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = "192.168.250.51" || "localhost";
  const PORTTr069 = "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerHistory/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        alert(`Item with ID ${id} deleted successfully.`);
        window.location.reload();
      } else {
        alert(`Failed to delete item with ID ${id}.`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerHistory/history/${id}`,
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
      const fileName = data.fileName || "default.xml";
      const fileData = data.files;
      const content = fileData;
      const decodedXmlContent = atob(content);
      const xmlData = decodedXmlContent;
      const blob = new Blob([xmlData], { type: "application/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error fetching or downloading file:", error);
      alert("Failed to download file. Please try again.");
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

  const fetchData2 = async () => {
    try {
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerHistory/historys`,
        {
          method: "GET",
          headers: {
            Authorization: Token,
          },
        }
      );
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  return (
    <>
      <Navbar />
      <Header Title="History" breadcrumb="/History" />
      <form
        className="history-list"
        style={{ marginLeft: "240px", marginRight: "40px" }}
      >
        <div className="form-group902232">
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
                <th>Version</th>
                <th>Action</th>
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
                  <td>{item.version}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={() => handleDownload(item.id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginLeft: "10px",
                      }}
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
      </form>

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
