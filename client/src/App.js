import React, { useCallback, useMemo, useReducer } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Login from './components/Login';
import authReducer from './reducer/Auth.reducer';
import AuthContext from './context/Auth';
import Header from './components/Header';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Ticket from './components/Ticket';

function App() {
  const [state, dispatch] = useReducer(authReducer, { auth: null, user: null });
  const RequireAuth = ({ children }) => {
    debugger;
    const data = window.localStorage.getItem('auth');

    if (!state.auth && !data) {
      return <Navigate to="/" replace />;
    } else if (data && !state.auth) {
      dispatch({ type: 'auth', payload: data });
      return <Navigate to="/home" replace />;
    }
    // console.log(location);
    return children;
  };

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/ticket"
            element={
              <RequireAuth>
                <Ticket />
              </RequireAuth>
            }
          />
          <Route
            path="/ticket/:ticketId"
            element={
              <RequireAuth>
                <Ticket />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
