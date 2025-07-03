import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Recipes from './pages/Recipes';
import Stock from './pages/Stock';
import ShoppingList from './pages/ShoppingList';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planning"
              element={
                <ProtectedRoute>
                  <Planning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedRoute>
                  <Stock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shopping-list"
              element={
                <ProtectedRoute>
                  <ShoppingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;