
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ApiaryList from './components/ApiaryList';
import ApiaryDetail from './components/ApiaryDetail';
import WorkLogView from './components/WorkLogView';
import VarroaControlView from './components/VarroaControlView';
import Assistant from './components/Assistant';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import PasswordRecovery from './components/PasswordRecovery';
import AuditLogView from './components/AuditLogView';

// Fix: Made children optional to prevent TypeScript error when using nested JSX elements.
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const { currentUser } = useApp();
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <HashRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<PasswordRecovery />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/apiaries" element={<ProtectedRoute><ApiaryList /></ProtectedRoute>} />
                <Route path="/apiaries/:id" element={<ProtectedRoute><ApiaryDetail /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute><WorkLogView /></ProtectedRoute>} />
                <Route path="/varroa" element={<ProtectedRoute><VarroaControlView /></ProtectedRoute>} />
                <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/audit" element={<ProtectedRoute><AuditLogView /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
          </HashRouter>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
