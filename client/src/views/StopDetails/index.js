import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "reactstrap";
import {
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  fetchRegisteredEmails,
  someApiToUpdateUserRole,
} from "../../services/agent";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import "./index.css";

const StopDetails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("roleChanged", ({ userId, role }) => {
      setEmails((prevEmails) =>
        prevEmails.map((user) =>
          user.userId === userId ? { ...user, role } : user
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getEmails = async () => {
    try {
      const response = await fetchRegisteredEmails();
      if (response && response.data && Array.isArray(response.data.data)) {
        setEmails(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmails();

    const intervalId = setInterval(() => {
      getEmails();
    }, 10000); // Polling interval set to 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await someApiToUpdateUserRole(userId, role);
      if (response.data.success) {
        toast.success("User role changed successfully");
        getEmails(); // Fetch updated emails immediately after role change
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message);
    }
  };

  const confirmRoleChange = (userId, role) => {
    const confirmationMessage =
      role === 2
        ? "Are you sure you want to reject this user?"
        : "Are you sure you want to approve this user?";
    if (window.confirm(confirmationMessage)) {
      handleRoleChange(userId, role);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "blue",
        }}
      >
        <Spinner style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <div className="registered-emails-box">
      <Toaster />
      <h2>Registered Emails</h2>
      <hr />
      <div className="registered-emails-table-container">
        <table className="registered-emails-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Serial Number</th>
              <th style={{ width: "20%" }}>Email</th>
              <th style={{ width: "20%" }}>City</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "40%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails
              .filter((user) => user.role !== 0)
              .map((user, index) => (
                <tr key={user.userId}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.city}</td>
                  <td>{user.role === 1 ? "Approved" : "Pending...."}</td>
                  <td>
                    {user.role === 1 ? (
                      <button
                        className="role-button"
                        onClick={() => confirmRoleChange(user.userId, 2)}
                      >
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="icon reject-icon"
                        />
                      </button>
                    ) : (
                      <>
                        <button
                          className="role-button"
                          onClick={() => confirmRoleChange(user.userId, 1)}
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="icon approve-icon"
                          />
                        </button>
                        <button
                          className="role-button"
                          onClick={() => confirmRoleChange(user.userId, 2)}
                        >
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="icon reject-icon"
                          />
                        </button>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="icon pending-icon"
                          spin
                        />
                      </>
                    )}
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
