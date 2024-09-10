import React, { useState, useEffect } from "react";
import Navbar from "./Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if(!Token) navigate("/log-in");
    const TokenData = JSON.parse(Token);
    const fetchData = async () => {
      try {
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
          `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/faultList`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + TokenData.AuthToken,
            },
          }
        );
        const data = await response.json();
        if(data.status === 0){
            const parsedData = JSON.parse(data.data);
            setApiData(parsedData);
            console.log(parsedData)
        }
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
      Title='Faults'
      breadcrumb ='/faults'/>
      <form className='history-list' style={{marginLeft:"240px", marginRight:"40px" }} >
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
                  <td>{item.detail.faultCode + ": " + item.detail.faultString}</td>
                  <td>{item.retries}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
