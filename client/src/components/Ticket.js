import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import AuthContext from '../context/Auth';
import M from 'materialize-css';

const Ticket = () => {
  const navigate = useNavigate();
  let { ticketId } = useParams();

  const [state, dispatch] = useContext(AuthContext);

  const intialState = {
    title: '',
    description: '',
    status: 'Pending',
    user: '',
    errors: {
      title: '',
      description: '',
      status: '',
      user: '',
    },
  };
  const [loginDetState, setLoginDetState] = useState(intialState);
  const { title, status, description, user, errors } = loginDetState;

  console.log(loginDetState);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (ticketId) {
      axios
        .get(`/ticket/${ticketId}`, {
          headers: { Authorization: `Bearer ${state.auth.access_token}` },
        })
        .then(({ data }) =>
          setLoginDetState((prev) => {
            return {
              ...prev,
              title: data.title,
              status: data.status,
              description: data.description,
              user: data.user.id,
            };
          }),
        );
    }
  }, [ticketId]);

  useEffect(() => {
    M.updateTextFields();
  });

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get('/user', {
          headers: { Authorization: `Bearer ${state.auth.access_token}` },
        })
        .then((user) => {
          setUsers(user.data);
        });
    };
    fetchUser();
  }, []);

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
      swal('Validation Error');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let obj = { ...loginDetState };

    if (validate()) {
      delete obj['errors'];

      let bodyArray = { ...loginDetState };
      delete bodyArray.errors;
      let method = 'post';
      let url = '/ticket';

      if (ticketId) {
        method = 'put';
        url += `/${ticketId}`;
      }

      axios({
        method: method,
        url,
        data: bodyArray,
        headers: { Authorization: `Bearer ${state.auth.access_token}` },
      })
        .then((response) => {
          const { status, message } = response.data;
          swal({
            title: 'Alert',
            text: ticketId ? 'Updated' : 'Inserted',
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then((willDelete) => {
            if (willDelete) {
              navigate('/home', { replace: true });
            }
          });
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
                  Add Ticket
                </span>
                <form onSubmit={handleSubmit} method="post">
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={handleChange}
                      />
                      <label htmlFor="title">Enter title</label>
                      <span className="error">{errors.title}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="text"
                        name="description"
                        id="description"
                        value={description}
                        onChange={handleChange}
                      />
                      <label htmlFor="description">Enter Description</label>
                      <span className="error">{errors.description}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <select
                        className="browser-default"
                        style={{ borderColor: 'black' }}
                        value={status}
                        name="status"
                        id="status"
                        onChange={handleChange}
                      >
                        <option value="">Choose status</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                        <option value="InProgress">InProgress</option>
                      </select>
                      <span className="error">{errors.status}</span>
                    </div>
                  </div>

                  {users && users.length > 0 && (
                    <div className="row">
                      <div className="input-field col s12">
                        <select
                          className="browser-default"
                          value={user}
                          name="user"
                          id="user"
                          onChange={handleChange}
                        >
                          <option value="">Assign to User</option>
                          {users.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                        <span className="error">{errors.user}</span>
                      </div>
                    </div>
                  )}

                  <br />
                  <center>
                    <div className="row">
                      <button
                        type="submit"
                        name="btn_login"
                        className="col s12 btn btn-large waves-effect indigo"
                      >
                        {ticketId ? `Update Ticket` : `Create Ticket`}
                      </button>
                    </div>
                    <Link className="indigo-text center-allign" to="/home">
                      Back
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

export default Ticket;
