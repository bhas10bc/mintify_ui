import React, { useState } from "react";
import "./OnBoarding.css";
import diamLogo from "../../Assets/DIAM.png";
import axios from "axios";
import { URI } from "../../Common";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decrypt, encrypt } from "../../Common/CommonComp";
import { useNavigate } from "react-router-dom";
import * as StellarSdk from "@stellar/stellar-sdk";

const OnBoarding = () => {
  const [viewMode, setViewMode] = useState("welcomeSec");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [publicKeyVal, setPublicKeyVal] = useState("");
  const [privateKeyVal, setPrivateKeyVal] = useState("");
  const [mpinVal, setMpinVal] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const onCopyText = () => {
    toast.info("Public address copied");
  };

  const errorShow = () => {
    toast.error("Invalid MPIN");
  };

  const errorShowWrong = () => {
    toast.error("Something went wrong");
  };

  const copyIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
        stroke="#03A9F4"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
        stroke="#03A9F4"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const swipeBtnOff = (
    <svg
      width="52"
      height="22"
      viewBox="0 0 58 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="56"
        height="26"
        rx="13"
        stroke="url(#paint0_linear_144_212)"
        stroke-width="2"
      />
      <circle cx="14" cy="14" r="9" fill="black" fill-opacity="0.2" />
      <defs>
        <linearGradient
          id="paint0_linear_144_212"
          x1="1"
          y1="1"
          x2="58.8109"
          y2="5.98063"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#03A9F4" />
          <stop offset="1" stop-color="#6FD2FF" />
        </linearGradient>
      </defs>
    </svg>
  );

  const swipeBtnOffOn = (
    <svg
      width="52"
      height="22"
      viewBox="0 0 58 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="56"
        height="26"
        rx="13"
        stroke="url(#paint0_linear_149_216)"
        stroke-width="2"
      />
      <circle cx="44" cy="14" r="9" fill="url(#paint1_linear_149_216)" />
      <defs>
        <linearGradient
          id="paint0_linear_149_216"
          x1="1"
          y1="1"
          x2="58.8109"
          y2="5.98063"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#03A9F4" />
          <stop offset="1" stop-color="#6FD2FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_149_216"
          x1="35"
          y1="5"
          x2="53.6901"
          y2="5.7476"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#03A9F4" />
          <stop offset="1" stop-color="#6FD2FF" />
        </linearGradient>
      </defs>
    </svg>
  );

  const createWallet = async () => {
    setLoader(true);
    await axios
      .get(URI.createWallet)
      .then((response) => {
        setViewMode("createWallet");
        setPublicKeyVal(response.data.publicAddress);
        setPrivateKeyVal(response.data.privateKey);
        setLoader(false);
      })
      .catch(() => {
        errorShowWrong();
        console.log("Error");
        setLoader(false);
      });
  };

  const createWalletClick = () => {
    const text = encrypt(privateKeyVal, mpinVal);
    localStorage.setItem("importWallet", text);
    setMpinVal("");
    setViewMode("loginWallet");
  };

  const importWallet = () => {
    const text = encrypt(privateKeyVal, mpinVal);
    localStorage.setItem("importWallet", text);
    setMpinVal("");
    setViewMode("loginWallet");
  };

  console.log("Diam Details", localStorage.getItem("importWallet"));

  const handleLogin = () => {
    try {
      const getVal = localStorage.getItem("importWallet");
      const test2 = decrypt(getVal, mpinVal);
      if (test2) {
        navigate("/homescreen", {
          state: {
            privateKVal: test2,
          },
        });
      } else if (test2 === null) {
        console.log("Error");
        errorShow();
      }
    } catch (error) {
      errorShowWrong();
    }
  };

  function getKeyPairFromPrivateKey(privateKey) {
    try {
      const kp = StellarSdk.Keypair.fromSecret(privateKey);
      const publicKey = kp.publicKey();
      // return { publicKey, privateKey };
      setPublicKeyVal(publicKey);
      // console.log("Public Key", publicKey);
    } catch (err) {
      console.error("Error:", err);
      return {};
    }
  }

  // const getVal = localStorage.getItem("diamDetails");
  //   console.log("Get Value", getVal);

  // const encrypted key=encrypt()

  // const addWallet = async () => {
  //   let encryptedRequestBody;
  //   let requestBody = {
  //     customerId: customerId,
  //     assetId: walletAssetId,
  //   };
  //   encryptedRequestBody = encryptedPayload(requestBody);
  //   await axios
  //     .post(
  //       URI.addWalletDetails,
  //       {
  //         encryptedRequestBody: encryptedRequestBody,
  //       },
  //       {
  //         headers: headers,
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data.status === 200) {

  //       } else {

  //       }
  //     })
  //     .catch(function (error) {
  //       __errorCheck(error);
  //     });
  // };

  const welcomeSection = () => {
    return (
      <div className="rightSection">
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="mainHeading">
          Welcome to <br />{" "}
          <span className="subHeadText">Diamante Net Token Tool</span>
          <p className="subText">Create your custom token</p>
        </div>
        <div className="mt-5">
          <button
            className={`${loader ? "disableBTN" : "createWalletBtn"}`}
            // onClick={() => setViewMode("createWallet")}
            onClick={createWallet}
          >
            Create Wallet
          </button>
          <button
            className="importWalletBtn"
            onClick={() => setViewMode("importWallet")}
          >
            Import Wallet
          </button>
        </div>
      </div>
    );
  };

  const createWalletSec = () => {
    return (
      <div className="rightSection">
        <div style={{ height: "70px" }}>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>

        <h3 className="createWalletHead">Create Wallet</h3>
        <p className="subText">
          Please provide a 6-digit PIN code for registration. This PIN code will
          be utilized to encrypt the secret key associated with your Diam
          address before storing it in your browser's local storage. Your secret
          key for this address will be retained solely on your device, ensuring
          that you have exclusive custody over it.
        </p>
        <div className="inputWalletSec">
          <div className="my-1">
            <label className="labelText">Public Key</label>
            <div className="inputContainer">
              <input
                className="inputboxStyle"
                style={{
                  width: "92%",
                  border: "none",
                  color: "#03A9F4",
                  fontSize: "15px",
                }}
                value={publicKeyVal}
                readOnly
              />
              <CopyToClipboard text={publicKeyVal} onCopy={onCopyText}>
                <span className="copybtn mt-1">{copyIcon}</span>
              </CopyToClipboard>
            </div>
            <label className="subLabel">Generate New Address?</label>
          </div>
          <div className="d-flex justify-content-between align-items-center my-3">
            <span className="labelText">Show Secret Key</span>
            <div onClick={() => setShowSecretKey(!showSecretKey)}>
              {showSecretKey ? swipeBtnOffOn : swipeBtnOff}
            </div>
          </div>
          {showSecretKey && (
            <input
              className="inputboxStyle"
              style={{
                width: "92%",
                border: "none",
                color: "#03A9F4",
                fontSize: "15px",
              }}
              value={privateKeyVal}
              readOnly
            />
          )}

          <div className="d-flex flex-column my-1">
            <label className="labelText">MPIN</label>
            <input
              type="text"
              className="inputContainer"
              value={mpinVal.replace(/[^0-9\s]/gi, "")}
              maxLength={6}
              minLength={6}
              onChange={(e) => setMpinVal(e.target.value)}
            />
          </div>
          <button
            className="BtnWallet my-3"
            disabled={!mpinVal}
            onClick={createWalletClick}
          >
            Create Wallet
          </button>
          <div
            className="text-end"
            style={{ fontSize: "0.7rem", fontWeight: "500" }}
            onClick={() => setViewMode("importWallet")}
          >
            Existing user?
            <span
              onClick={createWallet}
              style={{ color: "#03a9f4", cursor: "pointer" }}
            >
              {" "}
              Import Wallet
            </span>
          </div>
        </div>
      </div>
    );
  };

  const importWalletSec = () => {
    return (
      <div className="rightSection">
        <div style={{ height: "70px" }}>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>

        <h3 className="createWalletHead">Import Wallet</h3>
        <p className="subText">
          Please provide your private key and a 6-digit MPIN for import. This
          PIN code will be utilized to encrypt the secret key associated with
          your Diam address before storing it in your browser's local storage.
          Your secret key for this address will be retained solely on your
          device, ensuring that you have exclusive custody over it.
        </p>
        <div className="inputWalletSec">
          <div className="my-1">
            <label className="labelText">Private Key</label>
            <div className="inputContainer">
              <input
                className="inputboxStyle"
                style={{
                  width: "92%",
                  border: "none",
                  color: "#03A9F4",
                  fontSize: "15px",
                }}
                value={privateKeyVal}
                onChange={(e) => setPrivateKeyVal(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center my-3">
            <span className="labelText">Show Public Key</span>
            <div
              onClick={() => {
                setShowSecretKey(!showSecretKey);
                getKeyPairFromPrivateKey(privateKeyVal);
              }}
            >
              {showSecretKey ? swipeBtnOffOn : swipeBtnOff}
            </div>
          </div>
          {showSecretKey && (
            <input
              className="inputboxStyle"
              style={{
                width: "100%",
                border: "none",
                color: "#03A9F4",
                fontSize: "15px",
              }}
              value={publicKeyVal}
              readOnly
            />
          )}

          <div className="d-flex flex-column my-1">
            <label className="labelText">MPIN</label>
            <input
              type="text"
              className="inputContainer"
              value={mpinVal.replace(/[^0-9\s]/gi, "")}
              maxLength={6}
              minLength={6}
              onChange={(e) => setMpinVal(e.target.value)}
            />
          </div>
          <button
            className="BtnWallet my-3"
            disabled={!mpinVal}
            onClick={importWallet}
          >
            Import Wallet
          </button>
          <div
            className="text-end"
            style={{ fontSize: "0.7rem", fontWeight: "500" }}
          >
            New user?
            <span
              onClick={createWallet}
              style={{ color: "#03a9f4", cursor: "pointer" }}
            >
              {" "}
              Create wallet
            </span>
          </div>
        </div>
      </div>
    );
  };

  const loginWallet = () => {
    return (
      <div className="rightSection">
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h3 className="createWalletHead">Login </h3>
        <p className="subText">
          Provide your 6-digit pincode to access the dashboard. To reiterate,
          this pincode never leaves your device, and your secret key is
          encrypted in your browser and is never shared anywhere else.
        </p>
        <div className="inputWalletSec importWalletCont">
          <div className="d-flex flex-column my-1">
            <label className="labelText">MPIN</label>
            <input
              type="text"
              className="inputContainer"
              value={mpinVal.replace(/[^0-9\s]/gi, "")}
              maxLength={6}
              minLength={6}
              onChange={(e) => setMpinVal(e.target.value)}
            />
          </div>
          <button className="BtnWallet my-3" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  };

  const currentSection = () => {
    if (viewMode === "welcomeSec") return welcomeSection();
    else if (viewMode === "createWallet") return createWalletSec();
    else if (viewMode === "importWallet") return importWalletSec();
    else if (viewMode === "loginWallet") return loginWallet();
  };

  return (
    <div className="mainContainer">
      <div className="leftSection">
        <img src={diamLogo} height="70" width="auto" alt="" />
        DIAMANTE <br />
        NET
      </div>
      {currentSection()}
    </div>
  );
};

export default OnBoarding;
