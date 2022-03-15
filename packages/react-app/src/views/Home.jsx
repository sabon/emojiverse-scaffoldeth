import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
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
  const purpose = useContractReader(readContracts, "Emojiverse", "purpose");

  const { Content } = Layout;

  return (
    <>
      <Layout>
        <Content
          style={{ backgroundColor: "rgb(254, 228, 64)", width: "100%", display: "block", paddingBottom: "40px" }}
        >
          <h1 className="big-title">Emojiverse</h1>
          <h3 style={{ marginTop: 0, marginBottom: 0, fontWeight: 700, fontSize: "1.5rem" }}>
            Show what you are about, one emoji at a time.
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
        </Content>
        <Content>
          <Emojiboards />
          <FAQ />
          <Copyright />
        </Content>
      </Layout>
      <div>
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>📝</span>
          This Is Your App Home. You can start editing it in{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            packages/react-app/src/views/Home.jsx
          </span>
        </div>
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>✏️</span>
          Edit your smart contract{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            YourContract.sol
          </span>{" "}
          in{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            packages/hardhat/contracts
          </span>
        </div>
        {!purpose ? (
          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>👷‍♀️</span>
            You haven't deployed your contract yet, run
            <span
              className="highlight"
              style={{
                marginLeft: 4,
                /* backgroundColor: "#f9f9f9", */ padding: 4,
                borderRadius: 4,
                fontWeight: "bolder",
              }}
            >
              yarn chain
            </span>{" "}
            and{" "}
            <span
              className="highlight"
              style={{
                marginLeft: 4,
                /* backgroundColor: "#f9f9f9", */ padding: 4,
                borderRadius: 4,
                fontWeight: "bolder",
              }}
            >
              yarn deploy
            </span>{" "}
            to deploy your first contract!
          </div>
        ) : (
          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>🤓</span>
            The "purpose" variable from your contract is{" "}
            <span
              className="highlight"
              style={{
                marginLeft: 4,
                /* backgroundColor: "#f9f9f9", */ padding: 4,
                borderRadius: 4,
                fontWeight: "bolder",
              }}
            >
              {purpose}
            </span>
          </div>
        )}
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>🤖</span>
          An example prop of your balance{" "}
          <span style={{ fontWeight: "bold", color: "green" }}>({ethers.utils.formatEther(yourLocalBalance)})</span> was
          passed into the
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            Home.jsx
          </span>{" "}
          component from
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            App.jsx
          </span>
        </div>
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>💭</span>
          Check out the <Link to="/hints">"Hints"</Link> tab for more tips.
        </div>
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>🛠</span>
          Tinker with your smart contract using the <Link to="/debug">"Debug Contract"</Link> tab.
        </div>
      </div>
    </>
  );
}

export default Home;
