import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from './cards/header'


export default function History() {
  
  const [apiData, setApiData] = useState([]);
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
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
      }
    };
    fetchData2();
  }, [navigate, BaseUrlSpring, PORTSpring, BaseUrlTr069, PORTTr069, Token]);

  return (
    <>
      <Navbar />
      <Header 
      Title='History'
      breadcrumb ='/History'/>
      <form className='history-list' style={{marginLeft:"240px", marginRight:"40px" }} >
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
                  <td>{item.id}</td>
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
        </div>
      </form>
    </>
  );
}
