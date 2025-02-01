import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "./cards/header";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function History() {
  const [apiData, setApiData] = useState([]);
  const BaseUrlSpring = window.location.host.split(":")[0] || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const BaseUrlTr069 = window.location.host.split(":")[0] || "localhost";
  const PORTTr069 = "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const TokenData = JSON.parse(Token);
  
  const fetchData = async () => {
    try {
      if (!Token) navigate("/");
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
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/faultList`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
          },
        }
      );
      const data = await response.json();
      if (data.status === 0) {
        const parsedData = JSON.parse(data.data);
        setApiData(parsedData);
        console.log(parsedData);
      }
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
      <Header Title="Faults" breadcrumb="/faults" />
      <form
        className="history-list"
        style={{ marginLeft: "240px", marginRight: "40px" }}
      >
        <div className="form-group902232">
          <table className="styled-table2232">
            <thead>
              <tr>
                <th>Serial no.</th>
                <th>Device</th>
                <th>Channel</th>
                <th>Code</th>
                <th>Message</th>
                <th>Detail</th>
                <th>Retries</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.device}</td>
                  <td>{item.channel}</td>
                  <td>{item.code}</td>
                  <td>{item.message}</td>
                  <td>
                    {item.detail.faultCode + ": " + item.detail.faultString}
                  </td>
                  <td>{item.retries}</td>
                  <td>{item.timestamp}</td>
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
