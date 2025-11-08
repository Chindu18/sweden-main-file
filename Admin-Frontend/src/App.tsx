import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Scanner from "./pages/Scanner";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Revenue from "./pages/Revenue";
import Collector from "./pages/Collector";
import SnacksPicker from "./components/Snacks/SnacksPicker";
import SnackRevenew from "../src/components/Snacks/SnackRevenew";
import SnacksCollector from "../src/components/addcollectors/SnacksCollector";
import CampaignToggle from "./components/campaignmail/CampaignToggle";
import Snacksdistrubute from "./components/Snacks/Snacksdistrubute";

const queryClient = new QueryClient();

const ProtectedRouteAny: any = ProtectedRoute; // alias to bypass missing prop typing

// ✅ Custom wrapper that hides Navbar for scanner users
function Layout() {
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  // ❌ Hide navbar for scanner and login pages
  const hideNavbar =
    location.pathname === "/" || role === "scanner";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRouteAny>
          }
        />

        <Route path="/collectors" element={<Collector />} />

        <Route
          path="/movies"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <Movies />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/scanner"
          element={
            <ProtectedRouteAny allowedRoles={["scanner", "admin"]}>
              <Scanner />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <Contact />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/Revenue"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <Revenue />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/snacks"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <SnacksPicker />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/snacksrevenue"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <SnackRevenew />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/snackscollectorrevenue"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <SnacksCollector />
            </ProtectedRouteAny>
          }
        />

        <Route
          path="/snack-distribute"
          element={<Snacksdistrubute />}
/>

        <Route
          path="/Campaign"
          element={
            <ProtectedRouteAny allowedRoles={["admin"]}>
              <CampaignToggle />
            </ProtectedRouteAny>
          }
        />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
