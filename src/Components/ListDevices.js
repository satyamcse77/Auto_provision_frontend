import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "./cards/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOnlinePrediction } from "react-icons/md";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Fault() {
  
  const [apiData, setApiData] = useState([]);
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const BaseUrlTr069 = process.env.REACT_APP_API_tr069_URL || "localhost";
  const PORTTr069 = process.env.REACT_APP_API_tr069_PORT || "3000";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);
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
    fetchData();

    const fetchData2 = async () => {
      try {
        const TokenData = JSON.parse(Token);
        console.log(TokenData.AuthToken);
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
        if (data) {
          await setApiData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const intervalId = setInterval(() => {
      fetchData2();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [
    navigate,
    setApiData,
    apiData,
    BaseUrlSpring,
    PORTSpring,
    BaseUrlTr069,
    PORTTr069,
    Token,
  ]);

  const handleDelete = async (macAddress) => {
    const TokenData = JSON.parse(Token);
    try {
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/deleteListItem`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + TokenData.AuthToken,
            macAddress: macAddress,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.status === 0) {
        alert('Delete request successful');
      } else {
        alert('Delete request failed: ' + (data.message || 'No message'));
      }
    } catch (error) {
      console.error("Error making delete request", error);
    }
  };

  return (
    <>
      <Navbar />
      <Header Title="Listing devices" breadcrumb="/Listing_devices" />
      <form
        className="history-list"
        style={{ marginLeft: "240px", marginRight: "40px" }}
      >
        <div className="form-group902232">
          <table className="styled-table2232">
            <thead>
              <tr>
                <th>Serial no.</th>
                <th>MacAddress</th>
                <th>OUI</th>
                <th>Product class</th>
                <th>IpAddress</th>
                <th>Ping</th>
                <th>Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.macAddress}</td>
                  <td>{item.oui}</td>
                  <td>{item.productClass}</td>
                  <td>{item.ipAddress?item.ipAddress:"0.0.0.0"}</td>
                  <td>
                    {item.ping ?`${item.ping} ms`:""}
                  </td>
                  <td>
                    <MdOnlinePrediction
                      icon={MdOnlinePrediction}
                      style={{
                        cursor: "pointer",
                        color: item.ping && item.ipAddress ? "green" : "red",
                        marginLeft: "10px",
                      }}
                    />
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginLeft: "10px",
                      }}
                      onClick={() => handleDelete(item.macAddress)}
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
