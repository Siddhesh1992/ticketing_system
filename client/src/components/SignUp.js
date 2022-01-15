import React, { Fragment, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/Auth';

const SignUp = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [state, dispatch] = useContext(AuthContext);

  const intialState = {
    name: '',
    type: '',
    pass: '',
    errors: {
      name: '',
      type: '',
      pass: '',
    },
  };
  const [loginDetState, setLoginDetState] = useState(intialState);
  const { name, pass, type, errors } = loginDetState;

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
      swal('Alert', 'Check for Errors');
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
        .post(`auth/sign-up`, loginDetState)
        .then((response) => {
          const { data, status, message } = response.data;
          dispatch({ type: 'auth', payload: data });
          if (response.status === 201) {
            swal({
              title: "Success",
              text: "User Created Successfully, Login using credentials",
              closeOnClickOutside: false,
              closeOnEsc: false,
            }).then((willDelete) => {
              if (willDelete) {
                navigate('/');
              }
            });
          }
        })
        .catch((error) => {
          const { response } = error;

          const { data, status, message } = response.data;

          swal(status, message);
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
                  SIGN UP
                </span>
                <form onSubmit={handleSubmit} method="post">
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={handleChange}
                      />
                      <label htmlFor="name">Enter your name</label>
                      <span className="error">{errors.name}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="password"
                        name="pass"
                        id="pass"
                        value={pass}
                        onChange={handleChange}
                      />
                      <label htmlFor="pass">Enter your password</label>
                      <span className="error">{errors.pass}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <select
                        className="browser-default"
                        style={{ borderColor: 'black' }}
                        value={type}
                        name="type"
                        id="type"
                        onChange={handleChange}
                      >
                        <option value="">Choose user type</option>
                        {state.userType &&
                          state.userType.map((e) => {
                            return (
                              <option key={e.id} value={e.id}>
                                {e.name}
                              </option>
                            );
                          })}
                      </select>
                      <span className="error">{errors.type}</span>
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
                        Sign up
                      </button>
                    </div>
                    <Link className="indigo-text center-allign" to="/">
                      Have Account Sign in
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

export default SignUp;
