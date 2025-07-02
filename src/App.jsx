import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Authentication/Login';
import ForgetPassword from './components/Authentication/ForgetPassword';
import Mos_Dashboard from './components/Dashboard/Dashboard';
import State from './components/Dashboard/State';
import StateData from './components/Dashboard/StateData';

import ChlorinationDashboard from './components/Chlorination/Chl_Dashboard/ChlorinationDashboard';
import ChlorinationStateData from './components/Chlorination/Chl_Dashboard/DataCollection';
import ChlorinationUser from './components/Chlorination/Chl_Dashboard/ChlorinationUser';
import HubDistrictMaster from './components/Chlorination/Chl_Dashboard/ChlorinationStateMaster';


import HubDashboard from './components/Chlorination/Hub_Dashboard/hubDashboard';
import HubStateData from './components/Chlorination/Hub_Dashboard/hubDataCollection';
import HubUser from './components/Chlorination/Hub_Dashboard/hubUser';
import HubOfficerAdd from './components/Chlorination/Hub_Dashboard/hub_officer_add';
import HubBlockTable from './components/Chlorination/Hub_Dashboard/hubMasterTable';
import CorporationMasterTable from './components/Chlorination/Hub_Dashboard/hubCorporationMasterTable';
import GovernmentHospitalsMasterTable from './components/Chlorination/Hub_Dashboard/GovtHospitalMasterTable';
import EducationalInstitutionsMasterTable from './components/Chlorination/Hub_Dashboard/EducationalInstitutionsMasterTable';
import GovernmentInstitutionsMasterTable from './components/Chlorination/Hub_Dashboard/GovtInstMasterTable';
import PrisonMasterTable from './components/Chlorination/Hub_Dashboard/PrisonMasterTable';
import ApprovedHomesMasterTable from './components/Chlorination/Hub_Dashboard/ApprovedHomesMasterTable';
import TownPanchayatsMasterTable from './components/Chlorination/Hub_Dashboard/TownsMasterTable';
import MunicipalitiesMasterTable from './components/Chlorination/Hub_Dashboard/MunicipalitiesMasterTable';
import RailwayStationsMasterTable from './components/Chlorination/Hub_Dashboard/RailwayStationMasterTable';
import PWDMasterTable from './components/Chlorination/Hub_Dashboard/PWDMasterTable';
import TempleFestivalMasterTable from './components/Chlorination/Hub_Dashboard/TemplesMasterTable';
// master mosquito district table router
import MosDistrictMasterTable from './components/Dashboard/mos_dist_master'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/mosquito-admin-dashboard" element={<Mos_Dashboard />} />
        <Route path="/state" element={<State />} />
        <Route path="/data" element={<StateData />} />
        <Route path="/mos-district-master-table" element={<MosDistrictMasterTable />} />
        
          {/* Chlorination routes */}
          <Route path="/chl-admin-dashboard" element={<ChlorinationDashboard />} />
          <Route path="/chlorination-state" element={<ChlorinationUser />} />
           <Route path="/chlorination-HUB-district-master-table" element={<HubDistrictMaster />} />
          <Route path="/chlorination-data" element={<ChlorinationStateData />} /> 
          {/* <Route path="/chlorination-map/:lat/:lng" element={<ChlorinationMapPage />} /> */}
         

          <Route path="/hub-dashboard" element={<HubDashboard />} />
          <Route path="/hub-data" element={<HubStateData />} />
          <Route path="/hub-user" element={<HubUser />} />
          <Route path="/hub-block" element={<HubBlockTable />} />
          <Route path="/hub-corporation-master-table" element={<CorporationMasterTable />} />
          <Route path="/hub-hospitals-master-table" element={<GovernmentHospitalsMasterTable />} />
          <Route path="/hub-educational-institutions-master-table" element={<EducationalInstitutionsMasterTable />} />
          <Route path="/hub-government-institutions-master-table" element={<GovernmentInstitutionsMasterTable />} />
          <Route path="/hub-prison-master-table" element={<PrisonMasterTable />} />
          <Route path="/hub-approved-homes-master-table" element={<ApprovedHomesMasterTable />} />
          <Route path="/hub-towns-master-table" element={<TownPanchayatsMasterTable />} />
          <Route path="/hub-municipalities-master-table" element={<MunicipalitiesMasterTable />} />
          <Route path="/hub-railway-stations-master-table" element={<RailwayStationsMasterTable />} />
          <Route path="/hub-pwd-master-table" element={<PWDMasterTable />} />
          <Route path="/hub-temple-festival-master-table" element={<TempleFestivalMasterTable />} />
          {/* Mosquito routes */}
          <Route path="/add_user" element={< HubOfficerAdd/>} />
      </Routes>
      
    </Router>
  );
}

export default App;


