import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BillsPage from './pages/BillsPage';
import BillDetailPage from './pages/BillDetailPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import KnessetImportPage from './pages/KnessetImportPage';
import DashboardPage from './pages/DashboardPage';
import BillExplorePage from './pages/BillExplorePage';
import ArenaPage from './pages/ArenaPage';
import QuizResultsPage from './pages/QuizResultsPage';
import OrgsHomePage from './pages/portals/OrgsHomePage';
import OrgsBillPage from './pages/portals/OrgsBillPage';
import MediaHomePage from './pages/portals/MediaHomePage';
import MediaBillPage from './pages/portals/MediaBillPage';
import MkHomePage from './pages/portals/MkHomePage';
import MkBillPage from './pages/portals/MkBillPage';
import { useAuthStore } from './stores/authStore';

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { direction: 'rtl', fontFamily: 'Heebo' },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/bill/:id" element={<BillDetailPage />} />
          <Route path="/bill/:id/explore" element={<BillExplorePage />} />
          <Route path="/arena" element={<ArenaPage />} />
          <Route path="/results" element={<QuizResultsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/import" element={<KnessetImportPage />} />
          {/* Portal routes */}
          <Route path="/orgs" element={<OrgsHomePage />} />
          <Route path="/orgs/bill/:id" element={<OrgsBillPage />} />
          <Route path="/media" element={<MediaHomePage />} />
          <Route path="/media/bill/:id" element={<MediaBillPage />} />
          <Route path="/mk" element={<MkHomePage />} />
          <Route path="/mk/bill/:id" element={<MkBillPage />} />
        </Route>
      </Routes>
    </>
  );
}
