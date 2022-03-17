import React, { Fragment, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import AuthContext from '../context/Auth';

const Login = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [state, dispatch] = useContext(AuthContext);

  const intialState = {
    username: '',
    password: '',
    errors: {
      username: '',
      password: '',
    },
  };
  const [loginDetState, setLoginDetState] = useState(intialState);
  const { username, password, errors } = loginDetState;

  const validate = () => {
    let count = 0;

    Object.keys(loginDetState).forEach((e) => {
      if (!loginDetState[e]) {
        let name = e.replace(/([A-Z])/g, ' $1').trim();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        errors[e] = `${name} is required`;
        ++count;
      } else {
        errors[e] = '';
      }
    });

    if (count > 0) {
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let obj = { ...loginDetState };

    if (validate()) {
      delete obj['errors'];

      axios
        .post(`auth/login`, loginDetState)
        .then((response) => {
          window.localStorage.setItem('auth', response.data);
          dispatch({ type: 'auth', payload: response.data });
          navigate('/home', { replace: true });
        })
        .catch((error) => {
          const { response } = error;

          const { data, message } = response.data;

          swal('Alert', message);
          if (response.status === 422) {
            data.forEach((e) => {
              errors[e.param] = e.msg;
            });

            setLoginDetState({ ...loginDetState });
          } else {
          }
        });
    }

    setLoginDetState({ ...loginDetState });
  };

  const handleChange = (event) => {
    let { value, name } = event.target;
    errors[name] = '';

    setLoginDetState({ ...loginDetState, [name]: value });
  };

  return (
    <Fragment>
      <main>
        <div className="row">
          <div className="col s12 m4 offset-m4">
            <div className="card">
              <div className="card-content">
                <span className="card-title center-align indigo-text">
                  SIGN IN
                </span>
                <form onSubmit={handleSubmit} method="post">
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={handleChange}
                      />
                      <label htmlFor="username">Enter your username</label>
                      <span className="error">{errors.username}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handleChange}
                      />
                      <label htmlFor="password">Enter your password</label>
                      <span className="error">{errors.password}</span>
                    </div>
                  </div>

                  <br />
                  <center>
                    <div className="row">
                      <button
                        type="submit"
                        name="btn_login"
                        className="col s12 btn btn-large waves-effect indigo"
                      >
                        Login
                      </button>
                    </div>
                    <Link className="indigo-text center-allign" to="/sign-up">
                      Create account
                    </Link>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Login;
