import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import IpPhoneProvisioning from "./Components/Ip_phones/Ip_Phone_Provisioning";
import LinuxProvisioning from "./Components/Servers/SIP_Servers/Linux_Provisioning";
import AutoUpdate from "./Components/AutoUpdateList";
import History from "./Components/History";
import TimeSchedule from "./Components/TimeSchedule";
import LogIn from "./Components/LogIn";
import Setting from "./Components/System_setting";
import FileUpload from "./Components/FileUpload";
import ListDevices from "./Components/ListDevices";
import OnlineDevices from "./Components/cards/onlinePie";
import CiscoPhone from "./Components/Ip_phones/Cisco_phone";
import IotGateway from "./Components/Servers/IOT/Iot_gateway";
import CallServer from "./Components/Servers/CallServer/Call Server";
import AddIpAddress from "./Components/Servers/AddIpAddress";
import Faults from "./Components/Faults";
import PhoneFiles from "./Components/Ip_phones/PhoneFiles";

function App() {
  document.body.style.backgroundColor = '#4a4a4a';

  return (
    <div className="App">
       <BrowserRouter> {/* basename="/device-manager" */}
        <Routes>

          <Route path="/home" element={<Home/>}/>
          <Route path="/Backup_config" element={<PhoneFiles/>}/>
          <Route path="/cisco_CP-3905" element={<CiscoPhone/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/auto-update" element={<AutoUpdate/>}/>
          <Route path="/ip-phone-provisioning" element={<IpPhoneProvisioning/>}/>
          <Route path="/linux-provisioning" element={<LinuxProvisioning/>}/>
          <Route path="/time-schedule" element={<TimeSchedule/>}/>
          <Route path="/" element={<LogIn/>}/>
          <Route path="/system-setting" element={<Setting/>}/>
          <Route path="/fileUploadList" element={<FileUpload/>}/>
          <Route path="/listing-devices" element={<ListDevices/>}/>
          <Route path="/iot_gateway" element={<IotGateway/>}/>
          <Route path="/online-devices" element={<OnlineDevices/>}/>
          <Route path="/call-server" element={<CallServer/>}/>
          <Route path="/add-IPAddress" element={<AddIpAddress/>}/>
          <Route path="/faults" element={<Faults/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
