import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// Import images
import avatar1 from "../../assets/images/users/freelancer.png";
import { createSelector } from "reselect";

const ProfileDropdown = () => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const selectDashboardData = createSelector(
    (state) => state.Profile.user,
    (user) => user
  );

  // Inside your component
  const user = useSelector(selectDashboardData);

  const [userName, setUserName] = useState("المعلم");

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      setUserName(
        process.env.REACT_APP_DEFAULTAUTH === "fake"
          ? obj.username === undefined
            ? user.first_name
              ? user.first_name
              : obj.data.first_name
            : "Admin" || "Admin"
          : process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? obj.providerData[0].email
          : "Admin"
      );
    }
  }, [userName, user]);

  // Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  // Logout function
  const handleLogout = () => {
    // Clear all relevant items from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("loglevel"); // Clear log level
    localStorage.removeItem("user"); // Clear user data

    // Clear session storage if needed
    sessionStorage.removeItem("authUser");

    // Redirect to the login page or home page
    navigate("/login"); // Replace "/login" with your desired logout redirect path
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                Founder
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/*
<h6 className="dropdown-header">مرحباً {userName}</h6>
<div className="dropdown-divider"></div>
*/}

          <DropdownItem onClick={handleLogout}>
            <i // Added onClick handler
              className="mdi mdi-logout text-muted fs-16 align-middle me-1"
            ></i>{" "}
            <span className="align-middle" data-key="t-logout">
              الخروج
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
