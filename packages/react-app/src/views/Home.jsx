import { useState } from "react";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import Emojiform from "../components/Emojiform";
import TotalSupply from "../components/TotalSupply";
import Emojiboards from "../components/Emojiboards";
import FAQ from "../components/FAQ";
import Copyright from "../components/Copyright";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts, address, loadWeb3Modal }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  // const purpose = useContractReader(readContracts, "Emojiverse", "purpose");
  // const [currentAccount, setCurrentAccount] = useState(address);

  const { Content } = Layout;

  return (
    <>
      <Layout>
        <Content
          style={{ backgroundColor: "rgb(254, 228, 64)", width: "100%", display: "block", paddingBottom: "40px" }}
        >
          {/* Logged in? Show the form to create an Emojiboard */}
          {address ? (
            <>
              <h3
                className="h3-playful"
                style={{
                  marginTop: "15px",
                  marginBottom: "0px",
                  lineHeight: 0.8,
                  textShadow: "-0.04em 0.04em 0 #00BBF9",
                  fontWeight: 700,
                  padding: "0.4em 0.6em",
                }}
              >
                Express yourself, one emoji at a time.
              </h3>
              Choose from 1 to 4 message types, add emoji to each, and put it on the blockchain forever. Then show it to
              the world!
              <Emojiform />
            </>
          ) : (
            // Not logged in? Show the hero area and the login button
            <>
              <h1 className="big-title">Emojiverse</h1>
              <h3 style={{ marginTop: 0, marginBottom: 0, fontWeight: 700, fontSize: "1.5rem" }}>
                Express yourself, one emoji at a time.
              </h3>
              <div
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  paddingBottom: "16px",
                  paddingTop: "16px",
                  textAlign: "left",
                  fontSize: "1rem",
                }}
              >
                <p>Say what you want to say, with emoji.</p>
                <p>Create from 1 to 4 messages on your Emojiboard, and show with emoji:</p>
                <ul>
                  <li>Who you are...</li>
                  <li>How you feel...</li>
                  <li>Your message to the world (it can only be "gm" 😎 )</li>
                  <li>What you like...</li>
                  <li>What you believe in...</li>
                  <li>and more...</li>
                </ul>
              </div>
              <TotalSupply />
              <Button
                type="primary"
                key="loginbutton"
                style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4, backgroundColor: "#9b5de5", color: "#fff" }}
                shape="round"
                icon={<WalletOutlined />}
                size="large"
                /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
                onClick={loadWeb3Modal}
              >
                Connect wallet
              </Button>
            </>
          )}
        </Content>
        <Content>
          <Emojiboards address={address} />
          <FAQ />
          <Copyright />
        </Content>
      </Layout>
    </>
  );
}

export default Home;
