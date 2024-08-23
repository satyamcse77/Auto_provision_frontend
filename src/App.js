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
import Fault from "./Components/Fault";
import FileUpload from "./Components/FileUpload";
import ListDevices from "./Components/ListDevices";
import OnlineDevices from "./Components/cards/onlinePie";
import CiscoPhone from "./Components/Ip_phones/Cisco_phone";
import IotGateway from "./Components/Servers/IOT/Iot_gateway";

function App() {
  document.body.style.backgroundColor = '#4a4a4a';
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home/>}/>
          <Route path="/cisco_CP-3905" element={<CiscoPhone/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/auto-update" element={<AutoUpdate/>}/>
          <Route path="/ip-phone-provisioning" element={<IpPhoneProvisioning/>}/>
          <Route path="/linux-provisioning" element={<LinuxProvisioning/>}/>
          <Route path="/time-schedule" element={<TimeSchedule/>}/>
          <Route path="/log-in" element={<LogIn/>}/>
          <Route path="/system-setting" element={<Setting/>}/>
          <Route path="/fault" element={<Fault/>}/>
          <Route path="/fileUploadList" element={<FileUpload/>}/>
          <Route path="/listing-devices" element={<ListDevices/>}/>
          <Route path="/iot_gateway" element={<IotGateway/>}/>
          <Route path="/online-devices" element={<OnlineDevices/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
