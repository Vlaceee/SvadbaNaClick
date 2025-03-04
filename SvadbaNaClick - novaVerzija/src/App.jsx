/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Navigate,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OglasiPage from './pages/OglasiPage';
import OglasiPageMladenci from './pages/OglasiPageMladenci';
import OglasiPageBakerMladenci from './pages/OglasiPageBakerMladenci';
import OglasiPageRestoranMladenci from './pages/OglasiPageRestoranMladenci';
import OglasiPageDekoraterMladenci from './pages/OglasiPageDekoraterMladenci';

import FotografOglasPage from './pages/OglasPage/FotografOglasPage';
import FotografOglasPageLogged from './pages/OglasPage/FotografOglasPageLogged';
import PoslasticarOglasPage from './pages/OglasPage/PoslasticarOglasPage';
import PoslasticarOglasPageLogged from './pages/OglasPage/PoslasticarOglasPageLogged';
import DekoraterOglasPage from './pages/OglasPage/DekoraterOglasPage';
import DekoraterOglasPageLogged from './pages/OglasPage/DekoraterOglasPageLogged';
import RestoranOglasPage from './pages/OglasPage/RestoranOglasPage';
import RestoranOglasPageLogged from './pages/OglasPage/RestoranOglasPageLogged';
import RegisterFotografPage from './pages/RegisterFotografPage';
import RegisterClientPage from './pages/RegisterClientPage';
import ChooseRegisterPage from './pages/ChooseRegisterPage';
import SecurityCodePage from './pages/SecurityCodePage';
import ContactPage from './pages/ContactPage';
import ProfileClient from './pages/ProfileClient';
import ClientsOverview from './admin/pages/ClientsOverview';
import OglasiOvervew from './admin/pages/OglasiOverview';
import OglasiPageBaker from './pages/OglasiPageBaker';
// import OglasiPageDekorater from './pages/OglasiPageDekorater';
import OglasiPageRestoran from './pages/OglasiPageRestoran';
import OglasiPageDekorater from './pages/OglasiPageDekorater';
// eslint-disable-next-line import/no-named-as-default
import auth from './firebase';
import DekoraterProfile from './pages/OglasPage/DekoraterProfile';
import PoslasticarProfile from './pages/OglasPage/PoslasticarProfile';
import RestoranProfile from './pages/OglasPage/RestoranProfile';
import FotografProfile from './pages/OglasPage/FotografProfile';
import RegisterRestoranPage from './pages/RegisterRestoranPage';
import RegisterPoslasticarPage from './pages/RegisterPoslasticarPage';
import RegisterDekoraterPage from './pages/RegisterDekoraterPage';
import BadUrlPage from './pages/404Page';
import ZastareoProfil from './pages/ZastareoProfil';
import LandingPageAdmin from './pages/LandingPageAdmin';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user1) => {
      if (user1) {
        await user1.getIdTokenResult();
        setUser(user1);

        const response = await axios.get(`http://localhost:8080/korisnik/${user1.uid}`);
        const fetchedData = response.data;
        setUserType(fetchedData.TIP);
        console.log(userType);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const profileComponent = useMemo(() => {
    if (!user) {
      return <ProfileClient />;
    }
    // return <Navigate to="/" />;
    switch (userType) {
      case 'Mladenci':
      case 'Admin':
        return <ProfileClient />;
      case 'Restoran':
        return <RestoranProfile />;
      case 'Dekorater':
        return <DekoraterProfile />;
      case 'Poslasticar':
        return <PoslasticarProfile />;
      case 'Fotograf':
        return <FotografProfile />;
      case 'Zastarelo':
        return <ZastareoProfil />;

      default:
        return <ProfileClient />;
    }
  }, [user, userType]);

  return (
    <div className=" flex min-h-screen flex-col font-sncFont2">
      <Navbar />
      <div className="flex flex-1">
        <Routes>
          <Route path="/" exact element={user && userType === 'Admin' ? <LandingPageAdmin /> : <LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/skod" element={<SecurityCodePage />} />

          <Route path="/oglasi/fotograf" element={user && userType === 'Mladenci' ? <OglasiPageMladenci korisnik={user} /> : <OglasiPage />} />
          <Route path="/oglasi/restoran" element={user && userType === 'Mladenci' ? <OglasiPageRestoranMladenci korisnik={user} /> : <OglasiPageRestoran />} />
          <Route path="/oglasi/dekoracija" element={user && userType === 'Mladenci' ? <OglasiPageDekoraterMladenci korisnik={user} /> : <OglasiPageDekorater />} />
          <Route path="/oglasi/baker" element={user && userType === 'Mladenci' ? <OglasiPageBakerMladenci korisnik={user} /> : <OglasiPageBaker />} />

          {/* User logged in and they are 'Mladenci' = can reserve; if not logged in, can only view info */}
          <Route path="/fotograf/:id" element={user && userType === 'Mladenci' ? <FotografOglasPageLogged /> : <FotografOglasPage />} />
          <Route path="/poslasticar/:id" element={user && userType === 'Mladenci' ? <PoslasticarOglasPageLogged /> : <PoslasticarOglasPage />} />
          <Route path="/dekorater/:id" element={user && userType === 'Mladenci' ? <DekoraterOglasPageLogged /> : <DekoraterOglasPage />} />
          <Route path="/restoran/:id" element={user && userType === 'Mladenci' ? <RestoranOglasPageLogged /> : <RestoranOglasPage />} />

          <Route path="/profile" element={profileComponent} />

          {/* If user is logged in, cannot go to register or login */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <ChooseRegisterPage />} />
          <Route path="/register/fotograf" element={user ? <Navigate to="/" /> : <RegisterFotografPage />} />
          <Route path="/register/client" element={user ? <Navigate to="/" /> : <RegisterClientPage />} />
          <Route path="/register/restoran" element={user ? <Navigate to="/" /> : <RegisterRestoranPage />} />
          <Route path="/register/poslasticar" element={user ? <Navigate to="/" /> : <RegisterPoslasticarPage />} />
          <Route path="/register/dekorater" element={user ? <Navigate to="/" /> : <RegisterDekoraterPage />} />

          <Route path="/admin/clients" element={user && userType === 'Admin' ? <ClientsOverview /> : <Navigate to="/" />} />
          <Route path="/admin/ads" element={user && userType === 'Admin' ? <OglasiOvervew /> : <Navigate to="/" />} />
        

          <Route path="*" element={<BadUrlPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
