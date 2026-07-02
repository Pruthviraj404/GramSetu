import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageWaterAlerts from "./pages/waterman/ManageWaterAlerts";
import TaxPage from "./pages/citizen/TaxPage";
import ComplaintPage from "./pages/citizen/ComplaintPage";
import CertificatePage from "./pages/citizen/CertificatePage";
import NotificationsPage from "./pages/citizen/NotificationsPage";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTaxes from "./pages/admin/ManageTaxes";
import ManageComplaints from "./pages/admin/ManageComplaints";
import ManageCertificates from "./pages/admin/ManageCertificates";
import SendNotification from "./pages/admin/SendNotification";
import Navbar from "./components/Navbar";


const AuthenticatedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      {children}
    </main>

  </div>

);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/unauthorized" element={
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
              <h1 className="text-6xl font-bold text-red-500 mb-2">403</h1>
              <p className="text-xl font-semibold text-gray-800">Access Denied</p>
              <p className="text-gray-500 mt-1">You do not have permission to view this resource.</p>
            </div>
          } />

          <Route path="/citizen/*" element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <AuthenticatedLayout>
                <Routes>
                  <Route path="dashboard" element={<CitizenDashboard />} />
                  <Route path="taxes" element={<TaxPage />} />
                  <Route path="complaints" element={<ComplaintPage />} />
                  <Route path="certificates" element={<CertificatePage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                </Routes>

              </AuthenticatedLayout>
            </ProtectedRoute>
          } />


          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuthenticatedLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="taxes" element={<ManageTaxes />} />
                  <Route path="complaints" element={<ManageComplaints />} />
                  <Route path="certificates" element={<ManageCertificates />} />
                  <Route path="notifications" element={<SendNotification />} />


                </Routes>
              </AuthenticatedLayout>
            </ProtectedRoute>

          } />

          <Route path="/waterman/*" element={
            <ProtectedRoute allowedRoles={["WATERMAN"]}>
              <AuthenticatedLayout>
                <Routes>
                  <Route path="dashboard" element={<ManageWaterAlerts/>} />
                </Routes>
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/login" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Navigate to="/login"/>}/>
          






        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;