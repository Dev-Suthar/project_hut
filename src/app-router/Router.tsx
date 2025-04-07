import PageLayout from "layout/PageLayout";
import HomePage from "pages/home/Home";
import JoinUs from "pages/join-us/Joinus";
import Portfolio from "pages/portfolio/Portfolio";
import { Routes, Route, Navigate } from "react-router-dom";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/Joinus" element={<JoinUs />} />
        <Route index element={<Navigate to="/home" />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
