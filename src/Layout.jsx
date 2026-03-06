import React from 'react';
import AdminSidebar from './components/layout/AdminSidebar';
import ClientSidebar from './components/layout/ClientSidebar';
import ClientHeader from './components/layout/ClientHeader';

const adminPages = ['AdminOverview', 'AdminCompanies', 'AdminAnalytics', 'AdminAIMonitor', 'AdminSystemHealth', 'AdminBilling', 'AdminAlerts', 'AdminSettings'];
const clientPages = ['ClientDashboard', 'ClientLeads', 'ClientWorkflows', 'ClientPipeline', 'ClientHeatmap', 'ClientLiveFeed', 'ClientScheduledQueue', 'ClientMeetings', 'ClientAnalytics', 'ClientAILog', 'ClientIntervention', 'ClientSettings', 'ClientROI'];

export default function Layout({ children, currentPageName }) {
  const isAdmin = adminPages.includes(currentPageName);
  const isClient = clientPages.includes(currentPageName);
  const hasSidebar = isAdmin || isClient;

  if (!hasSidebar) {
    return <div className="min-h-screen bg-[#0a0a0f]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#09090f]">
      {isAdmin && <AdminSidebar currentPage={currentPageName} />}
      {isClient && <ClientSidebar currentPage={currentPageName} />}
      <div className="flex-1 flex flex-col min-h-screen ml-56">
        {isClient && <ClientHeader />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}