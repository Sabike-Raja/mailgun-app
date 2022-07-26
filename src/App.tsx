import React, { useEffect, useState, CSSProperties } from "react";
import grapesjs from "grapesjs";
import ClipLoader from "react-spinners/ClipLoader";
import styled, { css } from "styled-components";

import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css";
import "grapesjs/dist/grapes.min.js";
import "grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const DarkBackground = styled.div`
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;

function App() {
  const [editorRef, setEditorRef] = useState<any>(null);
  const [isMailGunIntegrationStarted, setIsMailGunIntegrationStarted] =
    useState<boolean>(false);
  const [needEmialValidation, setNeedEmailValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mailgunFinined, setMailgunfinished] = useState(false);
  const [otp, setOtp] = useState(null);

  // useEffect(() => {
  //   const editor: any = grapesjs.init({
  //     container: "#djs",
  //     plugins: ["gjs-preset-webpage"],
  //   });
  //   setEditorRef(editor);
  // }, []);

  // const loadHtml = () => {
  //   console.log(editorRef?.editor?.getHtml())
  //   console.log(editorRef?.editor?.getCss())
  // }

  const saveConfigurationAndSendOtp = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    // myHeaders.append(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    // );
    // myHeaders.append(
    //   "Access-Control-Allow-Headers",
    //   "Origin, Content-Type, X-Auth-Token"
    // );

    const tempOtp: any = Math.floor(100000 + Math.random() * 900000);

    setOtp(tempOtp);

    const raw = JSON.stringify({
      domain: e.target.domain.value,
      seceret: e.target.seceret.value,
      email: e.target.email.value,
      otp: tempOtp,
    });

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3001", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setNeedEmailValidation(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
      });
  };

  const OtpValidation = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setNeedEmailValidation(false);
      setIsMailGunIntegrationStarted(false);
      setIsLoading(false);
      if (otp == e.target.otp.value) {
        alert("Mailgun integration completed successfully");
        setMailgunfinished(true);
      } else {
        alert("Invalid Otp");
      }
    }, 1000);
  };

  return (
    <div className="container">
      <>
        {isLoading && (
          <DarkBackground>
            <ClipLoader
              color={"red"}
              loading={isLoading}
              cssOverride={override}
              size={150}
            />
          </DarkBackground>
        )}
      </>
      {/* <button onClick={loadHtml}>Click</button>
      <div id="djs" className="App"></div> */}
      <h3>Emial Integration</h3>
      {!isMailGunIntegrationStarted ? (
        <div>
          <div
            onClick={() => setIsMailGunIntegrationStarted(true)}
            className="logo-container"
          >
            <img
              className="mail-gun"
              src="https://images.ctfassets.net/y6oq7udscnj8/6ZBhy3wCQx3WhSaoejr2fs/d5ff47541079b886877a80ab5ca0a471/01_1121_SinchMailgunLogo_Mailgun-Colour.png"
            />
          </div>
          {mailgunFinined && (
            <button onClick={() => setMailgunfinished(false)} className="btn">
              Uninstall
            </button>
          )}
        </div>
      ) : (
        <>
          {needEmialValidation ? (
            <div>
              <form onSubmit={OtpValidation}>
                <h5>Mailgun Installation</h5>
                <h6>We have send an otp to your email id </h6>
                <div>
                  <input type="text" className="type-3" name="otp" />
                </div>
                <input className="btn" type="submit" value="Validate" />
              </form>
            </div>
          ) : (
            <div className="form-section">
              <h5>Mailgun Installation</h5>
              <form onSubmit={saveConfigurationAndSendOtp}>
                <p>
                  <span
                    onClick={() =>
                      window.open(
                        "https://help.mailgun.com/hc/en-us/articles/203380100-Where-Can-I-Find-My-API-Key-and-SMTP-Credentials-"
                      )
                    }
                  >
                    click here
                  </span>
                  to find your seceret and domain
                </p>
                <div>
                  <label>Mailgun Seceret</label>
                  <input type="text" name="seceret" className="type-3" />
                </div>
                <div>
                  <label>Mailgun Domain</label>
                  <input type="text" name="domain" className="type-3" />
                </div>
                <div>
                  <label>Email</label>
                  <input type="text" className="type-3" name="email" />
                </div>
                <input className="btn" type="submit" value="Submit" />
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
