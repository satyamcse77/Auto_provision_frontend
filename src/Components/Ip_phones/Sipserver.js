import React, { useState } from "react";
import Cookies from "js-cookie";
import IP2LG from "../Image/ip2lg.png";
import IP2LP from "../Image/ip2lp.png";
import IP4LP from "../Image/ip4lp.png";
import IP6LP from "../Image/ip6lp.png";
import AVP6LP from "../Image/avp6lp.png";
import Dropdown from "react-bootstrap/Dropdown";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SipServer() {

  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const navigate = useNavigate();
  const BaseUrlSpring = "192.168.250.51" || "localhost";
  const PORTSpring = process.env.REACT_APP_API_SPRING_PORT || "9093";
  const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";
  const Token = Cookies.get(CookieName);
  const [sipServer, setSipServer] = useState("");
  const [phoneSelect, setPhoneSelect] = useState("IP2LG");
  const [account, setAccount] = useState("1");
  const Profile = "1";
  const [totalNo, setTotalNo] = useState(2);
  // const [profileNo, setProfileTotalNo] = useState(2);
  const accountOptions = Array.from({ length: totalNo }, (_, i) => i + 1);
  // const profileOptions = Array.from({ length: profileNo }, (_, i) => i + 1);
  const [macAddress, setMacAddress] = useState("");
  const [account_Label, setAccount_Label] = useState("");
  const [account_SipUserId, setAccount_SipUserId] = useState("");
  const [account_AuthenticateID, setAccount_AuthenticateID] = useState("");
  const [account_DispalyName, setAccount_DispalyName] = useState("");
  const [account_Active, setAccount_Active] = useState(false);
  const [showOneByOne, setShowOneByOne] = useState(false);
  const [ShowPage, setShowPage] = useState(false);
  const [account_LocalSipPort, setAccount_LocalSipPort] = useState("");
  const [account_Password, setAccount_Password] = useState("1234");
  const [sipServerIp, setSipServerIp] = useState("");
  const [sipPort, setSipPort] = useState("");
  const [ShowPageBulk, setShowPageBulk] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const handleCheckboxChange = (e, setActive) => {
    setActive(e.target.checked);
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // To parse the CSV into JSON objects
        skipEmptyLines: true,
        complete: (result) => {
          const uniqueData = removeDuplicates(result.data);
          setFileData(uniqueData);
          console.log("data are :" + uniqueData);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const clearCsvFile = (event) => {
    setFileData([])
    setFileInputKey(Date.now());

  }

  // Function to remove duplicates based on the "macaddr" field
  const removeDuplicates = (data) => {
    const uniqueDataMap = new Map();
    data.forEach((item) => {
      uniqueDataMap.set(item.macaddr, item);
    });

    return Array.from(uniqueDataMap.values()); // Convert Map back to an array
  };

  const HandleSuccessResult = async (messageDetail) => {
    const macAddresses = messageDetail.split(",").map(mac => mac.trim());

    setLoading(false)
    alert(`Successfully updated macAddress: ${macAddresses.join(", ")}.`);
  }


  // const fetchData2 = async () => {
  //   try {
  //     const TokenData = JSON.parse(Token);
  //     const response = await fetch(
  //       `http://${BaseUrlSpring}:${PORTSpring}/api/deviceManagerInfo/allData`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: TokenData.AuthToken,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     if (data) {
  //       setApiData(data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const handleApiCall = async () => {
    setLoading(true);
    try {
      // await fetchData2();
      await new Promise(resolve => setTimeout(resolve, 5000));
      const payload = {
        sipServerIp: sipServerIp,
        sipPort: sipPort,
        epochTime: Date.now().toString(),
        accounts: fileData.map((row) => ({
          macAddress: row.macaddr,
          accountsActive: true,
          label: row.label,
          displayName: row.label,
          sipUserId: row.account,
          authenticateID: row.authid,
          Password: row.accpass,
          profile: row.sipprofile,
        })),
      };
      if (!Token) navigate("/");
      const TokenData = JSON.parse(Token);
      // Make the API call
      const response = await fetch(`http://${BaseUrlSpring}:${PORTSpring}/api/deviceManager/bulkProvisioning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + TokenData.AuthToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === 0) {
        await HandleSuccessResult(result.messageDetail);
      } else {
        console.error("API Error:", response.statusText);
        alert(`Error occurred: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending data to API:", error);
      alert("Error occurred while sending data.");
    } finally {
      setLoading(false);
    }
  };

  const CallSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const TokenData = await JSON.parse(Token);
      if (!showOneByOne) {
        let result = await account_SipUserId.split(",").filter(Boolean);
        result = result.length;
        if (totalNo < result) {
          alert("Give correct multiple account number. like: 2322, 4554");
          return;
        }
      }
      const postData = {
        sipServer: sipServer,
        macAddress: macAddress,
        accountNo: showOneByOne ? account : "-1",
        profileNo: Profile,
        phoneSelect: phoneSelect,
        account: {
          Label: account_Label,
          SipUserId: account_SipUserId,
          AuthenticateID: account_AuthenticateID,
          DispalyName: account_DispalyName,
          Active: account_Active,
          LocalSipPort: account_LocalSipPort,
          Password: account_Password,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="tabBarContainer2">
          <Dropdown>
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
                  setTotalNo(2);
                  // setProfileTotalNo(2);
                }}
              >
                IP2LG
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setPhoneSelect("IP2LP");
                  setTotalNo(2);
                  // setProfileTotalNo(2);
                }}
              >
                IP2LP
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setPhoneSelect("IP4LP");
                  setTotalNo(4);
                  // setProfileTotalNo(4);
                }}
              >
                IP4LP
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setPhoneSelect("IP6LP");
                  setTotalNo(16);
                  // setProfileTotalNo(6);
                }}
              >
                IP6LP
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setPhoneSelect("AVP6LP");
                  setTotalNo(16);
                  // setProfileTotalNo(6);
                }}
              >
                AVP6LP
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="buttonGroup2">
            <button
              type="button"
              className={`provisionButton2 ${showOneByOne && ShowPage ? 'active' : ''}`}
              onClick={() => {
                setShowOneByOne(true);
                setShowPage(true);
                setShowPageBulk(false);
              }}
            >
              Provision Single Account
            </button>

            <button
              type="button"
              className={`provisionButton2 ${ShowPageBulk ? 'active' : ''}`}
              onClick={() => {
                setShowOneByOne(false);
                setShowPage(false)
                setShowPageBulk(true);
              }}
            >
              Bulk Phone Provisioning
            </button>
          </div>
        </div>

        {ShowPage &&
          (
            <form
              className="SipServerForm"
              style={{ marginBottom: "50px", maxWidth: "850px" }}
              onSubmit={CallSubmit}
            >
              <div style={{ display: "flex" }}>
                <div className="form-group90">
                  <img
                    style={{
                      marginLeft: "50px",
                      height: "300px",
                      width: "250px",
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
                    {/* <div className="DropDown2" style={{ marginTop: "10px" }}>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Profile: {Profile}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {profileOptions.map((pro) => (
                            <Dropdown.Item
                              key={pro}
                              onClick={() => setProfile(String(pro))}
                            >
                              {pro}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div> */}
                    <label htmlFor="Sip_server_ip">
                      Sip_server_ip<span style={{ color: "red", marginTop: "20px" }}>*</span>
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
              {showOneByOne && (
                <div>
                  <div className="DropDown2">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Account: {account}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {accountOptions.map((acc) => (
                          <Dropdown.Item
                            key={acc}
                            onClick={() => setAccount(String(acc))}
                          >
                            {acc}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <div
                    className="form-accounts-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      width: "100%",
                      margin: "0 auto",
                    }}
                  >
                    {/* Account Partition */}

                    <div className="form-partition" style={{ width: "550px" }}>
                      <h3>Account {account}</h3>

                      <div className="form-group90">
                        <label htmlFor="account_LocalSipPort">
                          Account {account} local SIP port:
                        </label>
                        <input
                          type="number"
                          id="account_LocalSipPort"
                          value={account_LocalSipPort}
                          onChange={(e) =>
                            setAccount_LocalSipPort(e.target.value)
                          }
                          placeholder="Enter account local SIP port."
                          required
                        />
                      </div>

                      <div className="form-group90">
                        <label htmlFor="account_Active">
                          Account {account} active :
                        </label>
                        <input
                          type="checkbox"
                          id="account_Active"
                          name="account_Active"
                          className="input-field"
                          checked={account_Active}
                          onChange={(e) =>
                            handleCheckboxChange(e, setAccount_Active)
                          }
                        />
                      </div>

                      <div className="form-group90">
                        <label htmlFor="account_DispalyName">
                          Account {account} displayName :
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
                        <label htmlFor="account_Label">
                          Account {account} label :
                        </label>
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
                          onChange={(e) =>
                            setAccount_AuthenticateID(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="form-group90">
                        <label htmlFor="account_Password">
                          Account {account} Password:
                        </label>
                        <input
                          type="text"
                          id="account_Password"
                          value={account_Password}
                          onChange={(e) =>
                            setAccount_Password(e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!showOneByOne && (
                <div>
                  <div
                    className="form-accounts-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      width: "100%",
                      margin: "0 auto",
                    }}
                  >
                    {/* Account Partition */}

                    <div className="form-partition">
                      <h3>Accounts</h3>

                      <div className="form-group90">
                        <label htmlFor="account_LocalSipPort">
                          Accounts local SIP port:
                        </label>
                        <input
                          type="number"
                          id="account_LocalSipPort"
                          value={account_LocalSipPort}
                          onChange={(e) =>
                            setAccount_LocalSipPort(e.target.value)
                          }
                          placeholder="Enter account local SIP port."
                          required
                        />
                      </div>

                      <div className="form-group90">
                        <label htmlFor="account_Active">Accounts active :</label>
                        <input
                          type="checkbox"
                          id="account_Active"
                          name="account_Active"
                          className="input-field"
                          checked={account_Active}
                          onChange={(e) =>
                            handleCheckboxChange(e, setAccount_Active)
                          }
                        />
                      </div>

                      <div className="form-group90">
                        <label htmlFor="account_AuthenticateID">
                          Accounts authenticateID :
                        </label>
                        <input
                          type="text"
                          id="account_AuthenticateID"
                          value={account_AuthenticateID}
                          onChange={(e) =>
                            setAccount_AuthenticateID(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="form-group90">
                        <label htmlFor="account_Label">
                          Accounts Label :
                        </label>
                        <input
                          type="text"
                          id="account_Label"
                          value={account_Label}
                          onChange={(e) =>
                            setAccount_Label(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="form-group90">
                        <label htmlFor="account_SipUserId">
                          Accounts SIP User ID:
                          <span style={{ fontSize: "14px", color: "red" }}>
                            (Comma-separated values are supported for multiple
                            accounts.)
                          </span>
                        </label>

                        <input
                          type="text"
                          id="account_SipUserId"
                          value={account_SipUserId}
                          onChange={(e) => setAccount_SipUserId(e.target.value)}
                          required
                          placeholder="Enter comma-separated values"
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="button21">
                    Provision all form
                  </button>
                </div>
              )}
              <div className="form-group90">
                {showOneByOne && (
                  <button type="submit" className="button21">
                    Provision account {account}
                  </button>
                )}
              </div>
            </form>
          )}

        {
          ShowPageBulk && (
            <div>
              <div
                className="SipServerForm"
                style={{
                  padding: "20px",
                  marginBottom: "50px", maxWidth: "850px"
                }}
              >

                <h3>Enter Sip Server Ip</h3>
                <div className="Form-ip-provisioning">
                  <input
                    type="text"
                    id="sipServerIp"
                    className="ip-mac-input"
                    value={sipServerIp}
                    onChange={(e) => setSipServerIp(e.target.value)}
                    placeholder="Enter Sip Server Ip."
                    required
                  /></div>
                <h3>Enter Sip Port</h3>
                <div className="Form-ip-provisioning">
                  <input
                    type="text"
                    id="sipPort"
                    className="ip-mac-input"
                    value={sipPort}
                    onChange={(e) => setSipPort(e.target.value)}
                    placeholder="Enter Sip Port."
                    required
                  />
                </div>


                <h2>Upload File For Provisioning</h2>
                <input key={fileInputKey} type="file" accept=".csv" onChange={handleFileUpload} />
                <button onClick={clearCsvFile}>Clear</button>
                {fileData.length > 0 && (
                  <div className="form-group902232">
                    <table className="styled-table2232">
                      <thead>
                        <tr>
                          {Object.keys(fileData[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fileData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={handleApiCall}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Bulk Provision"}
                    </button>
                  </div>
                )}
              </div>

              {/* Loading Indicator */}
             {/* {isLoading && (
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
                    Please wait... while we are saving the data..
                  </div>
                </div>
              )} */}

            </div>
          )}
      </div >
    </>
  );
}
