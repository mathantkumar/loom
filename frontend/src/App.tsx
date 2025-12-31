import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layouts/PublicLayout';
import { AppLayout } from './components/layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { IncidentListPage } from './pages/IncidentListPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { StatsPage } from './pages/StatsPage';
import { AlertsPage } from './pages/AlertsPage';
import { TeamsPage } from './pages/TeamsPage';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { HelpPage } from './pages/HelpPage';
import PulsePage from './pages/PulsePage';
import { AskSentinelPage } from './pages/AskSentinelPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Layout (No Sidebar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* App Layout (With Sidebar) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<IncidentListPage />} />
          <Route path="/pulse" element={<PulsePage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />

          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/ask" element={<AskSentinelPage />} />

          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/report" element={<ReportIncidentPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
