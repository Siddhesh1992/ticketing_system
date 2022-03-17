import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/Auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const Header = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [state, dispatch] = useContext(AuthContext);

  useEffect(() => {
    M.updateTextFields();
    axios.get('auth/user-type').then((types) => {
      dispatch({ type: 'userType', payload: types.data });
    });
  }, [dispatch]);

  return (
    <header>
      <nav className="indigo">
        <div className="nav-wrapper container">
          <Link to="#" className="brand-logo">
            Assignment
          </Link>
          {state.auth ? (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li>
                <Link
                  to="#"
                  onClick={() => {
                    window.localStorage.removeItem('auth');
                    dispatch({ type: 'auth', payload: null });
                    navigate('/', { replace: true });
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            ''
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
