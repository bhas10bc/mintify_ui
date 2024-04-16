import React, { useState } from "react";
import "./HomeScreen.css";
import diamLogo from "../../Assets/DIAM.png";
import { Modal } from "react-bootstrap";
import { decrypt } from "../../Common/CommonComp";
import { URI } from "../../Common";
import CopyToClipboard from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import * as StellarSdk from "@stellar/stellar-sdk";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import tokenBg from "../../Assets/tokenBg.png";

const HomeScreen = () => {
  const [createTokenModal, setCreateTokenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("createTokenSec");
  const [showPvtKeyMod, setShowPvtKeyMod] = useState(false);
  const [mpinVal, setMpinVal] = useState("");
  const [pvtKeyVal, setPvtKeyVal] = useState("");
  const [pblKeyVal, setPblKeyVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showMpin, setShowMpin] = useState(false);
  const [tokenNameVal, setTokenNameVal] = useState("");
  const [symbolVal, setSymbolVal] = useState("");
  const [initSupplyVal, setInitSupplyVal] = useState("");
  const [loader, setLoader] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenLink, setTokenLink] = useState("");
  const [tokenData, setTokenData] = useState([]);
  // const [descripVal, setDescripVal] = useState("");

  const location = useLocation();

  const { privateKVal } = location.state || "";

  const onCopyText = () => {
    toast.info("Private Key copied");
  };

  const createTokenLogo = (
    <svg
      width="23"
      height="23"
      viewBox="0 0 35 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.1744 15.4418L27.7325 12.8837C28.3272 12.2889 28.6246 11.9916 28.8032 11.6822C29.2879 10.8427 29.2879 9.80841 28.8032 8.96892C28.6246 8.65956 28.3272 8.36219 27.7325 7.76745C27.1378 7.17271 26.8404 6.87534 26.531 6.69673C25.6915 6.21205 24.6572 6.21205 23.8177 6.69673C23.5084 6.87534 23.211 7.17271 22.6163 7.76745L20.0582 10.3256C18.8523 11.5315 18.2493 12.1344 17.5001 12.1344C16.7508 12.1344 16.1479 11.5315 14.942 10.3256L12.3838 7.76745C11.7891 7.17271 11.4917 6.87534 11.1824 6.69673C10.3429 6.21205 9.30859 6.21205 8.4691 6.69673C8.15974 6.87534 7.86237 7.17271 7.26763 7.76745C6.67288 8.36219 6.37551 8.65957 6.19691 8.96892C5.71223 9.80841 5.71223 10.8427 6.19691 11.6822C6.37551 11.9916 6.67288 12.2889 7.26763 12.8837L9.82574 15.4418C11.0316 16.6477 11.6346 17.2506 11.6346 17.9999C11.6346 18.7491 11.0316 19.3521 9.82574 20.558L7.26763 23.1161C6.67288 23.7108 6.37551 24.0082 6.19691 24.3176C5.71223 25.1571 5.71223 26.1914 6.19691 27.0309C6.37551 27.3402 6.67288 27.6376 7.26763 28.2323C7.86237 28.8271 8.15974 29.1244 8.46909 29.303C9.30859 29.7877 10.3429 29.7877 11.1824 29.303C11.4917 29.1244 11.7891 28.8271 12.3838 28.2323L14.942 25.6742C16.1479 24.4683 16.7508 23.8654 17.5001 23.8654C18.2493 23.8654 18.8523 24.4683 20.0582 25.6742L22.6163 28.2323C23.211 28.8271 23.5084 29.1244 23.8177 29.303C24.6572 29.7877 25.6915 29.7877 26.531 29.303C26.8404 29.1244 27.1378 28.8271 27.7325 28.2323C28.3272 27.6376 28.6246 27.3402 28.8032 27.0309C29.2879 26.1914 29.2879 25.1571 28.8032 24.3176C28.6246 24.0082 28.3272 23.7108 27.7325 23.1161L25.1744 20.558C23.9685 19.3521 23.3655 18.7491 23.3655 17.9999C23.3655 17.2506 23.9685 16.6477 25.1744 15.4418Z"
        stroke="#03A9F4"
        stroke-width="2.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

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

  const successTickIcon = (
    <svg
      width="60"
      height="60"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="40"
        cy="40"
        r="37.3333"
        stroke="#1D9F4B"
        stroke-width="5.33333"
      />
      <path
        d="M54.4 22L32.08 46.54L25.6 41.62H22L32.08 58L58 22H54.4Z"
        fill="#4BD37B"
      />
    </svg>
  );

  const infoCircleIcon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke="#01579B"
        stroke-width="1.5"
      />
      <path
        d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
        stroke="#01579B"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.992 8H12.001"
        stroke="#01579B"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const showMpinFun = () => {
    try {
      const getVal = localStorage.getItem("importWallet");
      console.log("Get Value", getVal);
      const test2 = decrypt(getVal, mpinVal);
      console.log("Decripted value", test2);
      if (test2) {
        setPvtKeyVal(test2);
        setShowMpin(true);
        setErrorMsg("");
      } else if (test2 === null) {
        setErrorMsg("Wrong MPIN");
        setMpinVal("");
      }
    } catch (error) {
      setErrorMsg(error);
    }
  };

  // function getKeyPairFromPrivateKey(privateKey) {
  //   try {
  //     // const kp = StellarSdk.Keypair.fromSecret(privateKey);
  //     // const publicKey = kp.publicKey();
  //     // console.log("PUBLIC", publicKey);
  //     // // return { publicKey, privateKey };
  //     // setPblKeyVal(publicKey);

  //     createToken();
  //     // console.log("Public Key", publicKey);
  //   } catch (err) {
  //     console.error("Error:", err);
  //     return {};
  //   }
  // }

  const getKeyPairFromPrivateKey = async (privateKey) => {
    setLoader(true);
    const kp = StellarSdk.Keypair.fromSecret(privateKey);
    // const publicKey = kp.publicKey();
    let requestBody = {
      publicKey: kp.publicKey(), // pblKeyVal,
      privateKey: privateKVal,
      tokenSupply: parseInt(initSupplyVal),
      tokenName: tokenNameVal,
    };
    await axios
      .post(URI.createToken, requestBody)
      .then((response) => {
        // Update the content of the paragraph
        // paragraph.textContent =
        //   "Transaction Hash: " + response.data.transactionHash;
        setLoader(false);
        setCreateTokenModal(true);
        setTokenAddress(response.data.issuanceAddress);
        setTokenLink(
          "https://testnetexplorer.diamcircle.io/about-txHash/" +
            response.data.transactionHash
        );
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const getManageToken = async (privateKey) => {
    const kp = StellarSdk.Keypair.fromSecret(privateKey);
    const publicK = kp.publicKey();
    await axios
      .get(URI.getAssets + "/" + publicK)
      .then((response) => {
        console.log("Manage Toke", response.data);
        setTokenData(response.data.tokenBalances);
      })
      .catch(() => {
        console.log("Error");
      });
  };

  const createTokenCont = () => {
    return (
      <div className="bottomMainSec">
        <div className="bottomLeftSec">
          <h5 className="my-4">Create custom token on Diamante net</h5>
          <div className="d-flex align-items-center gap-1 my-2">
            {createTokenLogo}{" "}
            <span className="opacity-50">
              Simple, fast and convenient token generator
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 my-2">
            {createTokenLogo}{" "}
            <span className="opacity-50">
              No smart contract programming required
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 my-2">
            {createTokenLogo}{" "}
            <span className="opacity-50">
              Get 100% ownership of generated tokens
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 my-2">
            {createTokenLogo}{" "}
            <span className="opacity-50">
              Set custom token name, symbol and initial supply
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 my-2">
            {createTokenLogo}{" "}
            <span className="opacity-50">
              Sign and create with your own wallet
            </span>
          </div>
        </div>
        <div className="bottomRightSec">
          <h5>Token Details</h5>

          <div className="inputSection">
            <label>
              Token name<span className="text-danger">*</span>
            </label>
            <input
              placeholder="e.g. Nice Token Name"
              className="inputboxStyle"
              type="text"
              minLength={5}
              maxLength={5}
              value={tokenNameVal.replace(/[^A-Za-z]+/g, "").toUpperCase()}
              onChange={(e) => setTokenNameVal(e.target.value)}
            />
          </div>
          <div className="inputSection">
            <label>
              Symbol<span className="text-danger">*</span>
            </label>
            <input
              placeholder="e.g. NT"
              className="inputboxStyle"
              type="text"
              minLength={5}
              maxLength={5}
              value={symbolVal.replace(/[^A-Za-z]+/g, "").toUpperCase()}
              onChange={(e) => setSymbolVal(e.target.value)}
            />
          </div>
          <div className="inputSection">
            <label>
              Initial supply<span className="text-danger">*</span>
            </label>
            <input
              placeholder="e.g. 21,000,000"
              type="text"
              maxLength={8}
              value={initSupplyVal.replace(/[^0-9\s]/gi, "")}
              onChange={(e) => setInitSupplyVal(e.target.value)}
              className="inputboxStyle"
            />
          </div>
          <div className="inputSection">
            <label>Description</label>
            <textarea className="inputboxStyle textarea" />
          </div>
          <button
            className={` ${loader ? "disableBTN" : "createTokBtn"}`}
            // onClick={() => setCreateTokenModal(true)}
            onClick={() => getKeyPairFromPrivateKey(privateKVal)}
            disabled={loader}
          >
            Create Token
            {/* <ClipLoader
              color="green"
              loading={loader}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            /> */}
          </button>
          {/* <p id="myParagraph"></p> */}
        </div>
      </div>
    );
  };

  const manageTokenCont = () => {
    return (
      <div style={{ height: "85vh", overflowY: "auto" }}>
        <link
          href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap"
          rel="stylesheet"
        ></link>
        <h3 className="text-center my-2">My Token details</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {tokenData.length !== 0 ? (
            tokenData.map((item) => {
              return (
                <div
                  key={item.assetIssuer}
                  style={{
                    width: "33%",
                    height: "35%",
                    border: "1px solid #000",
                    marginBottom: "2%",
                    fontSize: "0.9rem",
                    borderRadius: "5px",
                    padding: "1%",
                    backgroundImage: `url(${tokenBg})`,
                    backgroundSize: "conatin",
                    backgroundPosition: "center",
                    fontFamily: "Oxygen",
                  }}
                >
                  <p>
                    <span>Asset Code: </span>
                    {item?.asset_code}
                  </p>
                  <p>
                    <span>Asset Issuer: </span>
                    {item.asset_issuer?.slice(0, 4) +
                      "...." +
                      item.asset_issuer?.slice(-4)}
                  </p>
                  <p>
                    <span>Asset Balance: </span>
                    {parseInt(item?.balance).toFixed(2)}
                  </p>
                  <p>
                    <span>Asset Authorization: </span>
                    {item?.is_authorized === true ? "Active" : "Inactive"}
                  </p>
                  <p>
                    <span>Authorized to maintain: </span>
                    {item?.is_authorized_to_maintain_liabilities === true
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>
              );
            })
          ) : (
            <h5
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              No Data
            </h5>
          )}
        </div>
      </div>
    );
  };

  const currentBottomSec = () => {
    if (selectedItem === "createTokenSec") return createTokenCont();
    else if (selectedItem === "manageTokenSec") return manageTokenCont();
  };

  return (
    <div className="parentCont">
      <div className="sidebar">
        <div className="logoSec">
          <img src={diamLogo} height="40" width="auto" alt="" />
          <p>
            DIAMANTE
            <br /> NET
          </p>
        </div>
        <div className="menuBar">
          <div
            className={`d-flex align-items-center gap-1 py-3 menuItem ${
              selectedItem === "createTokenSec" && "selectedItemStyle"
            }`}
            onClick={() => setSelectedItem("createTokenSec")}
          >
            {createTokenLogo}{" "}
            <span
              className="menuItemText"
              // onClick={() => getKeyPairFromPrivateKey(privateKVal)}
            >
              Create Token
            </span>
          </div>
          {/* <div className={`d-flex align-items-center gap-1 py-3 menuItem`}>
            {createTokenLogo} <span className="menuItemText">Create NFT</span>
          </div> */}
          <div
            className={`d-flex align-items-center gap-1 py-3 menuItem ${
              selectedItem === "manageTokenSec" && "selectedItemStyle"
            }`}
            onClick={() => {
              getManageToken(privateKVal);
              setSelectedItem("manageTokenSec");
            }}
          >
            {createTokenLogo} <span className="menuItemText">Manage Token</span>
          </div>
          {/* <div className={`d-flex align-items-center gap-1 py-3 menuItem`}>
            {createTokenLogo} <span className="menuItemText">Manage NFT</span>
          </div> */}
          <div
            className={`d-flex align-items-center gap-1 py-3 menuItem  ${
              selectedItem === "showPrivateKey" && "selectedItemStyle"
            }`}
            onClick={() => {
              setSelectedItem("showPrivateKey");
              setShowPvtKeyMod(true);
            }}
          >
            {createTokenLogo}{" "}
            <span className="menuItemText">Show Private Key</span>
          </div>
        </div>
      </div>
      <div className="mainbar">
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
        <div className="topMainSec">
          <div className="leftmainSec">
            <span className="menuItemText">Token Tool</span>
            <span>by Diamante Net</span>
          </div>
          <div className="rightmainSec">
            <span className="opacity-50 cursorProp">Pricing</span>
            <span className="opacity-50 cursorProp">Contact</span>
          </div>
        </div>
        {currentBottomSec()}

        <Modal
          show={createTokenModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => setCreateTokenModal(false)}
        >
          <Modal.Body
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              paddingTop: "30px",
            }}
          >
            {successTickIcon}
            <h4 className="mt-3">Token Created successfully</h4>
            <div className="my-2" style={{ width: "100%" }}>
              <label className="text-left" style={{ marginLeft: "15%" }}>
                Token Address<span className="text-danger"></span>
              </label>
              <div className="inputCont">
                <input
                  value={tokenAddress}
                  className="inputboxStyle"
                  style={{
                    width: "92%",
                    border: "none",
                    color: "#03A9F4",
                    fontSize: "15px",
                  }}
                  readOnly
                />
                {copyIcon}
              </div>
            </div>
            <div className="my-2" style={{ width: "100%" }}>
              <label className="text-left" style={{ marginLeft: "15%" }}>
                Token Link<span className="text-danger"></span>
              </label>
              <div className="inputCont">
                <input
                  value={tokenLink}
                  className="inputboxStyle"
                  style={{
                    width: "92%",
                    border: "none",
                    color: "#03A9F4",
                    fontSize: "15px",
                  }}
                  readOnly
                />
                <CopyToClipboard text={tokenLink} onCopy={onCopyText}>
                  <span className="copybtn mt-1">{copyIcon}</span>
                </CopyToClipboard>
              </div>
            </div>
            <button
              className="connectWalletBTn px-2 my-3 mb-5"
              onClick={() => {
                getManageToken(privateKVal);
                setCreateTokenModal(false);
                setSelectedItem("manageTokenSec");
              }}
            >
              Go to Manage Token
            </button>
            <div
              style={{
                width: "70%",
                backgroundColor: "#F5F5F5",
                padding: "2%",
                display: "flex",
                flexDirection: "row",
                marginBottom: "2%",
                gap: "10px",
              }}
            >
              {infoCircleIcon}
              <span style={{ color: "#01579B" }}>
                You can import and manage your custom token in diam wallet .
                download diam wallet mobile application from here
              </span>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPvtKeyMod}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => {
            setSelectedItem("createToken");
            setShowPvtKeyMod(false);
            setShowPvtKeyMod(false);
            setShowMpin(false);
            setMpinVal("");
            setPvtKeyVal("");
            setErrorMsg("");
            setSelectedItem("createTokenSec");
          }}
        >
          <Modal.Body
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              paddingTop: "30px",
              height: "70vh",
            }}
          >
            <h4 className="mt-3">Private Key</h4>

            {showMpin ? (
              <div className="mpinInputStyle my-2" style={{ width: "95%" }}>
                <input
                  className="inputboxStyle"
                  style={{
                    width: "92%",
                    border: "none",
                    color: "#03A9F4",
                    fontSize: "15px",
                  }}
                  value={pvtKeyVal}
                  readOnly
                />
                <CopyToClipboard text={pvtKeyVal} onCopy={onCopyText}>
                  <span className="copybtn mt-1">{copyIcon}</span>
                </CopyToClipboard>
              </div>
            ) : (
              <div
                className="my-2 d-flex flex-column align-items-center"
                style={{ width: "100%" }}
              >
                <label className="text-left mb-2">Enter MPIN</label>
                <input
                  type="text"
                  className=" mpinInputStyle"
                  value={mpinVal.replace(/[^0-9\s]/gi, "")}
                  maxLength={6}
                  minLength={6}
                  onChange={(e) => setMpinVal(e.target.value)}
                />
              </div>
            )}
            <div style={{ height: "30px" }}>
              {errorMsg && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>
                  {errorMsg}
                </span>
              )}
            </div>
            {showMpin ? (
              <button
                className="connectWalletBTn px-2 my-1 mb-3 w-25"
                onClick={() => {
                  setShowPvtKeyMod(false);
                  setShowMpin(false);
                  setMpinVal("");
                  setPvtKeyVal("");
                  setErrorMsg("");
                  setSelectedItem("createToken");
                }}
              >
                Done
              </button>
            ) : (
              <button
                className="connectWalletBTn px-2 my-1 mb-3"
                onClick={showMpinFun}
              >
                Confirm MPIN
              </button>
            )}

            <div
              style={{
                width: "70%",
                backgroundColor: "#fce8e8",
                padding: "2%",
                display: "flex",
                flexDirection: "row",
                marginBottom: "2%",
                gap: "10px",
              }}
            >
              {infoCircleIcon}
              <span style={{ color: "#000" }}>
                Warning: Never disclose this key. Anyone with your private keys
                can steal any assets held in your account.
              </span>
            </div>
          </Modal.Body>
        </Modal>
      </div>
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
  );
};

export default HomeScreen;
