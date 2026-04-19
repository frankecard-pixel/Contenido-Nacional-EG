
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Vision from './pages/Vision';
import Directory from './pages/Directory';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Training from './pages/Training';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import LegalDetail from './pages/LegalDetail';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Community from './pages/Community';
import SocialProjectDetail from './pages/SocialProjectDetail';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationStatus from './pages/RegistrationStatus';
import Requirements from './pages/Requirements';
import SectorStats from './pages/SectorStats';
import ApplicationForm from './pages/ApplicationForm';
import CompanyProfileView from './pages/CompanyProfileView';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/company-profile/:id" element={<CompanyProfileView />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/training" element={<Training />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/apply/:opportunityId" element={<ApplicationForm />} />
          <Route path="/legal/cn-2014" element={<LegalDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/project/:id" element={<SocialProjectDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registration-status" element={<RegistrationStatus />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/sector-stats" element={<SectorStats />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
