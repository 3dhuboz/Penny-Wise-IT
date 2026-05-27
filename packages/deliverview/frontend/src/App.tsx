import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Record } from './pages/Record';
import { Handovers } from './pages/Handovers';
import { HandoverDetail } from './pages/HandoverDetail';
import { Clients } from './pages/Clients';
import { Settings } from './pages/Settings';
import { ViewerPage } from './pages/ViewerPage';

export function App() {
  return (
    <Routes>
      {/* Public: client viewer (no auth) */}
      <Route path="/view/:token" element={<ViewerPage />} />

      {/* Staff: Clerk-protected routes */}
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="record" element={<Record />} />
                  <Route path="handovers" element={<Handovers />} />
                  <Route path="handovers/:id" element={<HandoverDetail />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}
