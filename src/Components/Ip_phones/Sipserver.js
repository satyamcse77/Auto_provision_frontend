import React, { useState } from "react";
import Cookies from "js-cookie";
import IP2LG from "../Image/ip2lg.png";
import IP2LP from "../Image/ip2lp.png";
import IP4LP from "../Image/ip4lp.png";
import IP6LP from "../Image/ip6lp.png";
import AVP6LP from "../Image/avp6lp.png";
import Dropdown from "react-bootstrap/Dropdown";

export default function SipServer() {
  const BaseUrlSpring = process.env.REACT_APP_API_SPRING_URL || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9090";
  const CookieName = process.env.REACT_APP_COOKIENAME || "session";
  const Token = Cookies.get(CookieName);
  const [sipServer, setSipServer] = useState("");
  const [phoneSelect, setPhoneSelect] = useState("IP2LG");
  const [account, setAccount] = useState("1");
  const [totalNo, setTotalNo] = useState(2);
  const accountOptions = Array.from({ length: totalNo }, (_, i) => i + 1);
  const [macAddress, setMacAddress] = useState("");

  // Account 1 states
  const [account_Label, setAccount_Label] = useState("");
  const [account_SipUserId, setAccount_SipUserId] = useState("");
  const [account_AuthenticateID, setAccount_AuthenticateID] =
    useState("1234");
  const [account_DispalyName, setAccount_DispalyName] = useState("");
  const [account_Active, setAccount_Active] = useState(false);
  const [account_LocalSipPort, setAccount_LocalSipPort] = useState("");

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
        accountNo: account,
        phoneSelect: phoneSelect,
        account: {
          Label: account_Label,
          SipUserId: account_SipUserId,
          AuthenticateID: account_AuthenticateID,
          DispalyName: account_DispalyName,
          Active: account_Active,
          LocalSipPort: account_LocalSipPort,
        }
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
        <form
          className="SipServerForm"
          style={{ marginBottom: "50px" }}
          onSubmit={CallSubmit}
        >
          <div className="DropDown">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {phoneSelect}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {setPhoneSelect("IP2LG"); setTotalNo(2);}}
                >
                  IP2LG
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {setPhoneSelect("IP2LP"); setTotalNo(2);}}
                >
                  IP2LP
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {setPhoneSelect("IP4LP"); setTotalNo(4);}}
                >
                  IP4LP
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {setPhoneSelect("IP6LP"); setTotalNo(16);}}
                >
                  IP6LP
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setPhoneSelect("AVP6LP");
                    setTotalNo(16);
                  }}
                >
                  AVP6LP
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={{ display: "flex" }}>
            <div className="form-group90">
              <img
                style={{
                  marginLeft: "90px",
                  height: "250px",
                  width: "220px",
                }}
                src={
                  phoneSelect === "IP2LG"
                    ? IP2LG
                    : phoneSelect === "IP4LP"
                    ? IP4LP
                    : phoneSelect === "IP6LP"
                    ? IP6LP
                    : phoneSelect === "AVP6LP"
                    ? AVP6LP
                    : IP2LP
                }
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
          <div className="DropDown2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Account: {account}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {accountOptions.map((acc) => (
                  <Dropdown.Item key={acc} onClick={() =>  setAccount(String(acc))}>
                    {acc}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="form-accounts-container">
            {/* Account Partition */}

            <div className="form-partition">
              <h3>Account {account}</h3>

              <div className="form-group90">
                <label htmlFor="account_LocalSipPort">
                  Account {account} local SIP port:
                </label>
                <input
                  type="number"
                  id="account_LocalSipPort"
                  value={account_LocalSipPort}
                  onChange={(e) => setAccount_LocalSipPort(e.target.value)}
                  placeholder="Enter account local SIP port."
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account_Active">Account {account} active :</label>
                <input
                  type="checkbox"
                  id="account_Active"
                  name="account_Active"
                  className="input-field"
                  checked={account_Active}
                  onChange={(e) => handleCheckboxChange(e, setAccount_Active)}
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account_DispalyName">
                  Account {account} dispalyName :
                </label>
                <input
                  type="text"
                  id="account_DispalyName"
                  value={account_DispalyName}
                  onChange={(e) => setAccount_DispalyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account_Label">Account {account} label :</label>
                <input
                  type="text"
                  id="account_Label"
                  value={account_Label}
                  onChange={(e) => setAccount_Label(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account_SipUserId">
                  Account {account} SIP userId :
                </label>
                <input
                  type="text"
                  id="account_SipUserId"
                  value={account_SipUserId}
                  onChange={(e) => setAccount_SipUserId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group90">
                <label htmlFor="account_AuthenticateID">
                  Account {account} authenticateID :
                </label>
                <input
                  type="text"
                  id="account_AuthenticateID"
                  value={account_AuthenticateID}
                  onChange={(e) => setAccount_AuthenticateID(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group90">
            <button type="submit" className="button21">
              Provision account {account}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
