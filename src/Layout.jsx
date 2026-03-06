import React from 'react';
import AdminSidebar from './components/layout/AdminSidebar';
import ClientSidebar from './components/layout/ClientSidebar';
import { CampaignProvider } from './components/campaign/CampaignContext';

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
    <CampaignProvider>
      <div className="min-h-screen bg-[#09090f]">
        {isAdmin && <AdminSidebar currentPage={currentPageName} />}
        {isClient && <ClientSidebar currentPage={currentPageName} />}
        <main className="ml-56 min-h-screen">{children}</main>
      </div>
    </CampaignProvider>
  );
}