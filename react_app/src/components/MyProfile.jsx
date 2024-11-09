import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios';

const MyProfile = () => {
    const [search, setSearch] = useState("");
    const [user, setUser] = useState("");
    const [issearch, setisSearch] = useState(false);
    const resetSearch = () => {
        setSearch("");
        setisSearch(false);
      };
      useEffect(() => {
        const url = 'http://localhost:8000/myprofile/'+ localStorage.getItem('userId')
        axios
          .get(url)
          .then((res) => {
            if (res.data.user) {
              setUser(res.data.user);
            }
          })
          .catch(() => {
            alert("Server error occurred");
          });
      }, []);
  return (
    <>
    <Navbar search={search} resetSearch={resetSearch} />
    <h5 className="text-center">User Profile</h5>

{user && (
  <table className="table-auto border-collapse w-full max-w-md mx-auto mt-4">
    <thead>
      <tr>
        <th className="border-b px-4 py-2 text-left font-semibold text-gray-700">Field</th>
        <th className="border-b px-4 py-2 text-left font-semibold text-gray-700">Details</th>
      </tr>
    </thead>
    <tbody>
      {user.username && (
        <tr>
          <td className="border-t px-4 py-2">Username</td>
          <td className="border-t px-4 py-2">{user.username}</td>
        </tr>
      )}
      {user.mobile && (
        <tr>
          <td className="border-t px-4 py-2">Phone number</td>
          <td className="border-t px-4 py-2">{user.mobile}</td>
        </tr>
      )}
      {user.email && (
        <tr>
          <td className="border-t px-4 py-2">Email</td>
          <td className="border-t px-4 py-2">{user.email}</td>
        </tr>
      )}
    </tbody>
  </table>
)}

    </>
  )
}

export default MyProfile