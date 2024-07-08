import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  // EXTRACT THE SEARCH QUERY PARAMS FROM URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="md:w-56">
        <DashboardSidebar />
      </div>
      {/* MAIN */}
    </div>
  );
};

export default Dashboard;
