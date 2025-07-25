import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserRegistrationLogin from "pages/user-registration-login";
import HomeDashboardServiceDiscovery from "pages/home-dashboard-service-discovery";
import ProviderDashboardBookingManagement from "pages/provider-dashboard-booking-management";
import UserProfileAccountSettings from "pages/user-profile-account-settings";
import ServiceProviderProfiles from "pages/service-provider-profiles";
import ServiceBookingScheduling from "pages/service-booking-scheduling";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<HomeDashboardServiceDiscovery />} />
        <Route path="/user-registration-login" element={<UserRegistrationLogin />} />
        <Route path="/home-dashboard-service-discovery" element={<HomeDashboardServiceDiscovery />} />
        <Route path="/provider-dashboard-booking-management" element={<ProviderDashboardBookingManagement />} />
        <Route path="/user-profile-account-settings" element={<UserProfileAccountSettings />} />
        <Route path="/service-provider-profiles" element={<ServiceProviderProfiles />} />
        <Route path="/service-booking-scheduling" element={<ServiceBookingScheduling />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;