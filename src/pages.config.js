/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminAIMonitor from './pages/AdminAIMonitor';
import AdminAlerts from './pages/AdminAlerts';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminBilling from './pages/AdminBilling';
import AdminCompanies from './pages/AdminCompanies';
import AdminOverview from './pages/AdminOverview';
import AdminSettings from './pages/AdminSettings';
import AdminSystemHealth from './pages/AdminSystemHealth';
import ClientAILog from './pages/ClientAILog';
import ClientAnalytics from './pages/ClientAnalytics';
import ClientDashboard from './pages/ClientDashboard';
import ClientHeatmap from './pages/ClientHeatmap';
import ClientIntervention from './pages/ClientIntervention';
import ClientLeads from './pages/ClientLeads';
import ClientLiveFeed from './pages/ClientLiveFeed';
import ClientMeetings from './pages/ClientMeetings';
import ClientPipeline from './pages/ClientPipeline';
import ClientROI from './pages/ClientROI';
import ClientScheduledQueue from './pages/ClientScheduledQueue';
import ClientSettings from './pages/ClientSettings';
import ClientWorkflows from './pages/ClientWorkflows';
import RoleSelect from './pages/RoleSelect';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminAIMonitor": AdminAIMonitor,
    "AdminAlerts": AdminAlerts,
    "AdminAnalytics": AdminAnalytics,
    "AdminBilling": AdminBilling,
    "AdminCompanies": AdminCompanies,
    "AdminOverview": AdminOverview,
    "AdminSettings": AdminSettings,
    "AdminSystemHealth": AdminSystemHealth,
    "ClientAILog": ClientAILog,
    "ClientAnalytics": ClientAnalytics,
    "ClientDashboard": ClientDashboard,
    "ClientHeatmap": ClientHeatmap,
    "ClientIntervention": ClientIntervention,
    "ClientLeads": ClientLeads,
    "ClientLiveFeed": ClientLiveFeed,
    "ClientMeetings": ClientMeetings,
    "ClientPipeline": ClientPipeline,
    "ClientROI": ClientROI,
    "ClientScheduledQueue": ClientScheduledQueue,
    "ClientSettings": ClientSettings,
    "ClientWorkflows": ClientWorkflows,
    "RoleSelect": RoleSelect,
}

export const pagesConfig = {
    mainPage: "RoleSelect",
    Pages: PAGES,
    Layout: __Layout,
};