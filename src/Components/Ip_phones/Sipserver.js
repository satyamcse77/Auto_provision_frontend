import React, { useState } from "react";
import Cookies from "js-cookie";
import IP2LG from "../Image/ip2lg.png";

export default function SipServer() {

  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);
  const [sipServer, setSipServer] = useState("");
  const [macAddress, setMacAddress] = useState("");

  // Account 1 states
  const [account1_Label, setAccount1_Label] = useState("");
  const [account1_SipUserId, setAccount1_SipUserId] = useState("");
  const [account1_AuthenticateID, setAccount1_AuthenticateID] =
    useState("1234");
  const [account1_DispalyName, setAccount1_DispalyName] = useState("");
  const [account1_Active, setAccount1_Active] = useState(false);
  const [account1_LocalSipPort, setAccount1_LocalSipPort] = useState("");

  // Account 2 states
  const [account2_Label, setAccount2_Label] = useState("");
  const [account2_SipUserId, setAccount2_SipUserId] = useState("");
  const [account2_AuthenticateID, setAccount2_AuthenticateID] =
    useState("1234");
  const [account2_DispalyName, setAccount2_DispalyName] = useState("");
  const [account2_Active, setAccount2_Active] = useState(false);
  const [account2_LocalSipPort, setAccount2_LocalSipPort] = useState("");

  const handleCheckboxChange = (e, setActive) => {
    setActive(e.target.checked);
  };

  const CallSubmit = async (event) => {
    event.preventDefault();
    try {
      const TokenData = await JSON.parse(Token);
      const postData = {
        sipServer: sipServer,
        macAddress: macAddress,
        account1: {
          Label: account1_Label,
          SipUserId: account1_SipUserId,
          AuthenticateID: account1_AuthenticateID,
          DispalyName: account1_DispalyName,
          Active: account1_Active,
          LocalSipPort: account1_LocalSipPort,
        },
        account2: {
          Label: account2_Label,
          SipUserId: account2_SipUserId,
          AuthenticateID: account2_AuthenticateID,
          DispalyName: account2_DispalyName,
          Active: account2_Active,
          LocalSipPort: account2_LocalSipPort,
        },
      };
   
      const response = await fetch(
        `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/sip/${macAddress}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TokenData.AuthToken}`,
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        alert(`Account creation successful.`);
      } else {
        alert(`Failed to create account.`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <>
      <div>
        <form className="SipServerForm" style={{marginBottom: "50px"}} onSubmit={CallSubmit}>
          <div style={{ display: "flex" }}>
            <div className="form-group90">
              <img
                style={{marginLeft:"100px", height: "220px", width: "120px" }}
                src={IP2LG}
                alt="Loading..."
              />
            </div>
            <div className="form-group90">
              <label htmlFor="macAddress">
                MacAddress<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="macAddress"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                placeholder="Enter mac-address"
                required
              />
              <div className="form-group90">
                <label htmlFor="Sip_server_ip">
                  Sip_server_ip<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  id="Sip_server_ip"
                  value={sipServer}
                  onChange={(e) => setSipServer(e.target.value)}
                  placeholder="Enter sip server ip"
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-accounts-container">
            {/* Account 1 Partition */}
            <div className="form-partition">
              <h3>Account 1</h3>

              <div className="form-group90">
                <label htmlFor="account1_LocalSipPort">
                  Account 1 local SIP port:
                </label>
                <input
                  type="number"
                  id="account1_LocalSipPort"
                  value={account1_LocalSipPort}
                  onChange={(e) => setAccount1_LocalSipPort(e.target.value)}
                  placeholder="Enter account 1 local SIP port."
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account1_Active">Account 1 active :</label>
                <input
                  type="checkbox"
                  id="account1_Active"
                  name="account1_Active"
                  className="input-field"
                  checked={account1_Active}
                  onChange={(e) => handleCheckboxChange(e, setAccount1_Active)}
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account1_DispalyName">
                  Account 1 dispalyName :
                </label>
                <input
                  type="text"
                  id="account1_DispalyName"
                  value={account1_DispalyName}
                  onChange={(e) => setAccount1_DispalyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account1_Label">Account 1 label :</label>
                <input
                  type="text"
                  id="account1_Label"
                  value={account1_Label}
                  onChange={(e) => setAccount1_Label(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account1_SipUserId">
                  Account 1 SIP userId :
                </label>
                <input
                  type="text"
                  id="account1_SipUserId"
                  value={account1_SipUserId}
                  onChange={(e) => setAccount1_SipUserId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account1_AuthenticateID">
                  Account 1 authenticateID :
                </label>
                <input
                  type="text"
                  id="account1_AuthenticateID"
                  value={account1_AuthenticateID}
                  onChange={(e) => setAccount1_AuthenticateID(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Account 2 Partition */}
            <div className="form-partition">
              <h3>Account 2</h3>

              <div className="form-group90">
                <label htmlFor="account2_LocalSipPort">
                  Account 2 local SIP port:
                </label>
                <input
                  type="number"
                  id="account2_LocalSipPort"
                  value={account2_LocalSipPort}
                  onChange={(e) => setAccount2_LocalSipPort(e.target.value)}
                  placeholder="Enter account 2 local SIP port."
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account2_Active">Account 2 active :</label>
                <input
                  type="checkbox"
                  id="account2_Active"
                  name="account2_Active"
                  className="input-field"
                  checked={account2_Active}
                  onChange={(e) => handleCheckboxChange(e, setAccount2_Active)}
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account2_DispalyName">
                  Account 2 dispalyName :
                </label>
                <input
                  type="text"
                  id="account2_DispalyName"
                  value={account2_DispalyName}
                  onChange={(e) => setAccount2_DispalyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account2_Label">Account 2 label :</label>
                <input
                  type="text"
                  id="account2_Label"
                  value={account2_Label}
                  onChange={(e) => setAccount2_Label(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account2_SipUserId">
                  Account 2 SIP userId :
                </label>
                <input
                  type="text"
                  id="account2_SipUserId"
                  value={account2_SipUserId}
                  onChange={(e) => setAccount2_SipUserId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account2_AuthenticateID">
                  Account 2 authenticateID :
                </label>
                <input
                  type="text"
                  id="account2_AuthenticateID"
                  value={account2_AuthenticateID}
                  onChange={(e) => setAccount2_AuthenticateID(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group90">
            <button type="submit" className="button21">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
