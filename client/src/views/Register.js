import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import InputPasswordToggle from "@components/input-password-toggle";
import { statusCode } from "../utility/constants/utilObject";
import { Col, CardText, Form, Label, Input, Button, Spinner } from "reactstrap";
import "@styles/react/pages/page-authentication.scss";
import toast from "react-hot-toast";
import { showErrorToast, showSuccessToast } from "../utility/helper";
import { getUserNameFromEmail } from "../utility/helper";
import { otpHandler } from "../services/agent";
import { ReactComponent as EmailVerify } from "../assets/images/pages/Email-Verify.svg";
import { ChevronLeft } from "react-feather";
import { Message } from "../utility/constants/message";
import OtpVerification from "./OtpVerification"; // Import your otpVerification component here

const Register = () => {
  const { skin } = useSkin();

  const [data, setData] = useState({
    full_name: "",
    contact: "",
    password: "",
    ConfirmPassword: "",
    city: "",
  });
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState(false);
  const [iAgree, setIAgree] = useState(false);
  const [showVerificationPage, setShowVerificationPage] = useState(false);
  const [otp, setOtp] = useState("");
  const [Payload, setPayload] = useState("");
  const indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Surat",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan-Dombivli",
    "Vasai-Virar",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Howrah",
    "Ranchi",
    "Gwalior",
    "Jabalpur",
    "Coimbatore",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Solapur",
    "Hubballi-Dharwad",
    "Bareilly",
    "Mysore",
    "Tiruchirappalli",
    "Tiruppur",
    "Moradabad",
    "Salem",
    "Aligarh",
    "Thiruvananthapuram",
    "Bhiwandi",
    "Saharanpur",
    "Gorakhpur",
    "Bikaner",
    "Amravati",
    "Noida",
    "Jamshedpur",
    "Bhilai Nagar",
    "Cuttack",
    "Firozabad",
    "Kochi",
    "Bhavnagar",
    "Dehradun",
    "Durgapur",
    "Asansol",
    "Nanded-Waghala",
    "Kolapur",
    "Ajmer",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Siliguri",
    "Jhansi",
    "Ulhasnagar",
    "Nellore",
    "Jammu",
    "Sangli-Miraj & Kupwad",
    "Belgaum",
    "Mangalore",
    "Ambattur",
    "Tirunelveli",
    "Malegaon",
    "Gaya",
    "Udaipur",
    "Maheshtala",
    "Warangal",
    "Mira-Bhayandar",
    "Jalgaon",
    "Guntur",
    "Bhiwani",
    "Saharanpur",
    "Bhatpara",
    "Karnal",
    "Tirupati",
    "Ujjain",
    "Pondicherry",
    "Bilaspur",
    "Rourkela",
    "Panipat",
    "Anantapur",
    "Hapur",
    "Gandhinagar",
    "Parbhani",
    "Bathinda",
    "Shimla",
    "Anantapur",
    "Kharagpur",
    "Barasat",
    "Rohtak",
    "Karnal",
    "Bharuch",
    "Bijapur",
    "Rampur",
    "Shivamogga",
    "Mehsana",
    "Tumkur",
    "Khammam",
    "Puducherry",
    "Panihati",
    "Mangalore",
    "Karimnagar",
    "Haridwar",
    "Sri Ganganagar",
    "Tiruvottiyur",
    "Naihati",
    "Secunderabad",
    "Dibrugarh",
    "Thanjavur",
    "Yamunanagar",
    "Purnia",
    "Satna",
    "Raichur",
    "Motihari",
    "Gandhidham",
    "Udupi",
    "Tenali",
    "Haldia",
    "Bhilwara",
    "Ongole",
    "Nandyal",
    "Miryalaguda",
    "Kumbakonam",
    "Sirsa",
    "Thiruvananthapuram",
    "Nagaon",
    "Hazaribagh",
    "Sambalpur",
    "Junagadh",
    "Navsari",
    "Guna",
    "Rajnandgaon",
    "Ahmednagar",
    "Begusarai",
    "Kolar",
    "Suryapet",
    // Add more cities if needed
  ]; // State to hold the OTP

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmail = /\S+@\S+\.\S+/.test(data.contact);
    if (data.password.length < 8) {
      showErrorToast("Password must be at least 8 characters long.");
      return;
    }

    // Check if password and confirm password match
    if (data.password !== data.ConfirmPassword) {
      showErrorToast("Password and Confirm Password do not match.");
      return;
    }
    const payload = {
      full_name: data.full_name,
      contact: data.contact,
      password: data.password,
      ConfirmPassword: data.ConfirmPassword,
      city: data.city,
      role: 2,
      username: isEmail ? getUserNameFromEmail(data.contact) : data.contact,
      phone: isEmail ? null : data.contact,
      email: isEmail ? data.contact : null,
    };
    setLoader(true);
    setPayload(payload);
    otpHandler({
      email: isEmail ? data.contact : null,
      phone: isEmail ? null : data.contact,
    })
      .then((res) => {
        setLoader(false);
        if (res.status == statusCode.HTTP_200_OK) {
          setStatus(true);
          showSuccessToast("OTP sent successfully. Please verify!");
          setShowVerificationPage(true);
          setOtp(res.data.otp);
        } else if (res.request.status == statusCode.HTTP_400_BAD_REQUEST) {
          showErrorToast(res.response.data.message);
        } else if (res.request.status == statusCode.HTTP_401_UNAUTHORIZED) {
          showErrorToast("Unauthorized request. User Already registered.");
        }
      })
      .catch((err) => {
        setLoader(false);
        showErrorToast("Something went wrong. Please try again later.");
        console.error("Error:", err);
      });
  };

  const onChecked = () => {
    setIAgree(!iAgree);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {!showVerificationPage ? (
        <div
          style={{
            width: "400px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Sign Up
            </h2>

            <div style={{ marginBottom: "15px" }}>
              <Label
                for="full_name"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                User Name *
              </Label>
              <Input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Enter Full Name"
                value={data.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <Label
                for="contact"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Email *
              </Label>
              <Input
                type="text"
                id="contact"
                name="contact"
                placeholder="E-mail"
                value={data.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: "15px", position: "relative" }}>
              <Label
                for="password"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Password *
              </Label>
              <InputPasswordToggle
                id="password"
                name="password"
                placeholder="Create a password"
                value={data.password}
                onChange={handleChange}
                required
              />
              <CardText
                style={{ fontSize: "12px", color: "#6c757d", marginTop: "5px" }}
              >
                Password must be 8 characters long
              </CardText>
            </div>

            <div style={{ marginBottom: "15px", position: "relative" }}>
              <Label
                for="ConfirmPassword"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Confirm Password *
              </Label>
              <InputPasswordToggle
                id="ConfirmPassword"
                name="ConfirmPassword"
                placeholder="Create a password"
                value={data.ConfirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <Label
                for="city"
                style={{
                  marginBottom: "5px",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                City *
              </Label>
              <select
                id="city"
                name="city"
                value={data.city}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
                }}
              >
                <option value="" disabled>
                  Select your city
                </option>
                {indianCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Input
                type="checkbox"
                id="terms"
                checked={iAgree}
                onChange={onChecked}
                required
                style={{ marginRight: "10px" }}
              />
              <Label for="terms">
                I agree with the
                <Link
                  to="/terms"
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    marginLeft: "5px",
                  }}
                >
                  Terms & Conditions
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              color="primary"
              block
              style={{
                background: "#007bff",
                borderColor: "#007bff",
                padding: "10px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "4px",
              }}
            >
              {loader && <Spinner size="sm" style={{ marginRight: "5px" }} />}
              Sign Up
            </Button>
          </Form>
          <p
            style={{ marginTop: "20px", textAlign: "center", color: "#6c757d" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      ) : (
        <OtpVerification userData={Payload} otp={otp} />
      )}
    </div>
  );
};

export default Register;
