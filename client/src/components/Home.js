import React, { useEffect, useRef, useState, useContext } from 'react';
import M from 'materialize-css';
import { createSearchParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import AuthContext from '../context/Auth';
// const Home = ({ auth, signIn }) => {

const Home = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [user, setUser] = useState([]);
  const [state, dispatch] = useContext(AuthContext);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('/ticket', {
          headers: { Authorization: `Bearer ${state.auth.access_token}` },
        })
        .then(({ data }) => {
          setTableData(data);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get('user', {
          headers: { Authorization: `Bearer ${state.auth.access_token}` },
        })
        .then((user) => {
          setUser(user.data);
        });
    };
    fetchUser();
  }, []);

  // const handleChange = (event) => {
  //   let { value, name } = event.target;

  //   setDateState({ ...dateState, [name]: value });
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  // };

  // const deleteUser = (transId) => {
  //   swal({
  //     title: 'Alert',
  //     text: 'Are you sure you want to delete this record',
  //     closeOnClickOutside: false,
  //     closeOnEsc: false,
  //     dangerMode: true,
  //     buttons: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios({
  //         method: 'delete',
  //         url: '/api/transaction',
  //         data: { transId },
  //       }).then((e) => {
  //         fetchData();
  //       });
  //     }
  //   });
  // };

  return (
    <main className="container">
      <div className="row">
        <h5 className="col s10">My Tickets</h5>
        {user && user.length > 0 && (
          <div className="input-field col s2">
            <Link to="/ticket" className="indigo-text right">
              <i className="small material-icons">add_circle</i>
            </Link>
          </div>
        )}
      </div>

      <table className="centered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Settings</th>
          </tr>
        </thead>

        <tbody>
          {tableData > 0 ? (
            <tr>
              <td colSpan="5">No Data</td>
            </tr>
          ) : (
            tableData.map((ev) => (
              <tr key={ev.id}>
                <td>{ev.title}</td>
                <td>{ev.description}</td>
                <td>{ev.status}</td>
                <td>
                  {/* <Link to='#' onClick={() => deleteUser(ev._id)}>
                    <i className='small indigo-text material-icons'>delete</i>
                  </Link> */}
                  <Link to={`/ticket/${ev.id}`}>
                    <i className="small indigo-text material-icons">edit</i>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Home;
