import React, { useEffect, useState } from "react";
import {
  fetchRegisteredEmails,
  someApiToUpdateUserRole,
} from "../../services/agent"; // Adjust the import path
import "./index.css"; // Import CSS file for styling (create this file)
import toast, { Toaster } from "react-hot-toast";

const StopDetails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEmails = async () => {
      try {
        const response = await fetchRegisteredEmails();
        console.log("Response from fetchRegisteredEmails:", response);
        if (response && response.data && Array.isArray(response.data.data)) {
          setEmails(response.data.data); // Adjust to access response.data.data
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getEmails();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      // Make an API call to update the role
      const response = await someApiToUpdateUserRole(userId, role);
      console.log(response);
      if (response.data.success) {
        //console.log("hahahaha yaha to aaya hai");
        toast.success("User role changed successfully");
        // Wait for the toast to appear before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Adjust the timeout duration as needed
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="registered-emails-box">
      <Toaster /> {/* Include the Toaster component here */}
      <h2>Registered Emails</h2>
      <hr />
      <div className="registered-emails-table-container">
        <table className="registered-emails-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Serial Number</th>
              <th style={{ width: "20%" }}>Email</th>
              <th style={{ width: "20%" }}>Role</th>
              <th style={{ width: "40%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === 0
                    ? "Admin"
                    : user.role === 1
                    ? "Standard"
                    : "Normal"}
                </td>
                <td>
                  <button
                    className="role-button"
                    onClick={() => handleRoleChange(user.userId, 0)}
                    disabled={user.role === 0}
                  >
                    {user.role === 0 ? "Admin" : "Make Admin"}
                  </button>
                  <button
                    className="role-button"
                    onClick={() => handleRoleChange(user.userId, 1)}
                    disabled={user.role === 1}
                  >
                    {user.role === 1 ? "Standard" : "Make Standard"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StopDetails;
