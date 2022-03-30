import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import { Contract, NetworkDisplay, NetworkSwitch } from "./../components";
import { NETWORKS, ALCHEMY_KEY } from "./../constants";
import externalContracts from "./../contracts/external_contracts";
// contracts
import deployedContracts from "./../contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./../helpers";
import { useContractLoader, useContractReader, useUserProviderAndSigner } from "eth-hooks";

import { useStaticJsonRPC } from "./../hooks";
import { ethers } from "ethers";
// import Emojiverse from "../artifacts/contracts/EmojiSVG.sol/Emojiverse.json";
// import LoadingIndicator from "./LoadingIndicator";
import GraphemeSplitter from "grapheme-splitter";

import { Form, Input, Select, Tooltip, Button, Space, Typography } from "antd";
import { format } from "prettier";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const OPENSEA_CONTRACT_ADDRESS = process.env.REACT_APP_OPENSEA_CONTRACT_ADDRESS;

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.rinkeby; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

const EmojiForm = () => {
  const [emojiContract, setEmojiContract] = useState(null);
  const [formValues, setFormValues] = useState("");

  const [mintState, setMintState] = useState("");
  const [mintedEmojiboard, setMintedEmojiboard] = useState([]);

  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const web3Modal = Web3ModalSetup();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  // const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);

  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, false);

  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  const mainnetProvider = useStaticJsonRPC(providers);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  const readContracts = useContractLoader(localProvider, contractConfig);
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  const EmojiverseContract = writeContracts;
  console.log("Emojiverse contract: ", EmojiverseContract);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const handleSubmit = values => {
    // values.preventDefault();
    console.log("FormValues: ", values);

    const emojis = [];
    const messages = [];

    if (values.msg1.message) {
      messages.push(values.msg1.message);
      if (values.msg1.message === "gm") {
        emojis.push("");
      } else {
        emojis.push(handleEmoji(values.msg1.emoji));
      }
    }

    if (values.msg2.message) {
      messages.push(values.msg2.message);
      if (values.msg2.message === "gm") {
        emojis.push("");
      } else {
        emojis.push(handleEmoji(values.msg2.emoji));
      }
    }

    if (values.msg3.message) {
      messages.push(values.msg3.message);
      if (values.msg3.message === "gm") {
        emojis.push("");
      } else {
        emojis.push(handleEmoji(values.msg3.emoji));
      }
    }

    if (values.msg4.message) {
      messages.push(values.msg4.message);
      if (values.msg4.message === "gm") {
        emojis.push("");
      } else {
        emojis.push(handleEmoji(values.msg4.emoji));
      }
    }

    console.log("Emojis", emojis);
    console.log("Messages", messages);

    askContractToMintNft(emojis, messages);
  };

  const askContractToMintNft = async (emojis, messages) => {
    try {
      if (EmojiverseContract) {
        console.log("Minting NFT");
        console.log("writeContracts:", writeContracts);
        setMintState("minting");
        const mintTxn = await writeContracts.Emojiverse.mintEmojiverseNFT(emojis, messages, { gasLimit: 5000000 });
        console.log(`See transaction: https://rinkeby.etherscan.io/tx/${mintTxn.hash}`);
        setMintState("minted");
        // Listen to the contract's CreatedEmojiboard event
        EmojiverseContract.on("CreatedEmojiboard", (tokenId, tokenURI) => {
          console.log(`Token #${tokenId} minted. tokenURI: ${tokenURI}`);
          // Set the mintedEmojiboard in state.
          setMintedEmojiboard([tokenId.toString(), JSON.parse(Buffer.from(tokenURI.substring(29), "base64")).image]);
          // Wait 30 seconds and hide the message
          setTimeout(() => setMintedEmojiboard([]), 30000);
        }).on("error", console.error);
      } else {
        console.log("Emoji contract not loaded");
      }
    } catch (error) {
      console.log(error);
      setMintState("");
    }
  };

  const handleEmoji = msg => {
    // Take an object with [message] and [emoji] keys
    // If [message] is not set, do nothing
    // If [message] is set and it's "dm", return just the message
    // If [message] and [emoji] are set, trim [emoji] to one character and check if it is an emoji
    // If it's not an emoji, return an error message
    // Return [message] and [emoji]
    const emojiRegex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

    const emoji = GraphemeSplitter().splitGraphemes(msg)[0];
    if (emojiRegex.test(emoji)) {
      return emoji;
    } else {
      console.log("Emoji is not valid:", emoji);
      return "Error: Emoji is not valid";
    }
  };

  // useEffect(() => {
  //   const { ethereum } = window;

  //   ethereum ? console.log("ethereum", ethereum) : console.log("no ethereum");

  //   if (ethereum) {
  //     const provider = new ethers.providers.Web3Provider(ethereum);
  //     const signer = provider.getSigner();
  //     const emojiContract = new ethers.Contract(CONTRACT_ADDRESS, Emojiverse.abi, signer);

  //     // Set the gameContract in state.
  //     setEmojiContract(emojiContract);
  //   } else {
  //     console.log("Ethereum object not found");
  //   }
  // }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "1em auto",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingBottom: "16px",
        paddingTop: "16px",
        textAlign: "center",
        fontSize: "1rem",
      }}
    >
      <Tooltip title="If you're on your Mac, press: CONTROL + COMMAND + SPACE. On Windows, press: WINDOWS LOGO KEY + . (period)'">
        ❓ <span style={{ cursor: "pointer", textDecoration: "underline dotted red" }}>How to type an emoji?</span>
      </Tooltip>
      <div>
        <Form
          name="complex-form"
          // layout="inline"
          size="large"
          // onSubmit={handleSubmit}
          onFinish={handleSubmit}
          style={{ textAlign: "left", margin: "2em auto 0 auto", width: "350px" }}
        >
          <Form.Item style={{ margin: 0 }}>
            <Input.Group>
              <Form.Item
                name={["msg1", "message"]}
                rules={[{ required: true, message: "At least 1 msg is required" }]}
                style={{ display: "inline-block" }}
              >
                <Select
                  placeholder="Message #1"
                  style={{ width: "200px", marginRight: "10px" }}
                  onChange={e => {
                    setFormValues({
                      ...formValues,
                      msg1: e,
                    });
                  }}
                >
                  <Select.Option value="gm">gm</Select.Option>
                  <Select.Option value="I am...">I am...</Select.Option>
                  <Select.Option value="I feel...">I feel...</Select.Option>
                  <Select.Option value="I like...">I like...</Select.Option>
                  <Select.Option value="I want...">I want...</Select.Option>
                  <Select.Option value="I think...">I think...</Select.Option>
                  <Select.Option value="I do...">I do...</Select.Option>
                  <Select.Option value="I believe in...">I believe in...</Select.Option>
                  <Select.Option value="I build...">I build...</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={["msg1", "emoji"]}
                // rules={[{ required: true, message: "Emoji is required" }]}
                onChange={e => {
                  setFormValues({
                    ...formValues,
                    emoji1: e.target.value,
                  });
                }}
                style={{
                  display: "inline-block",
                  visibility: formValues["msg1"] === "gm" ? "hidden" : "visible",
                }}
              >
                <Input style={{ width: "140px" }} maxLength="5" placeholder="Enter 1 emoji" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item style={{ margin: 0 }}>
            <Input.Group>
              <Form.Item name={["msg2", "message"]} style={{ display: "inline-block" }}>
                <Select
                  placeholder="Message #2"
                  style={{ width: "200px", marginRight: "10px" }}
                  onChange={e => {
                    setFormValues({
                      ...formValues,
                      msg2: e,
                    });
                  }}
                >
                  <Select value="gm">gm</Select>
                  <Select value="I am...">I am...</Select>
                  <Select value="I feel...">I feel...</Select>
                  <Select value="I like...">I like...</Select>
                  <Select value="I want...">I want...</Select>
                  <Select value="I think...">I think...</Select>
                  <Select value="I do...">I do...</Select>
                  <Select value="I believe in...">I believe in...</Select>
                  <Select value="I build...">I build...</Select>
                </Select>
              </Form.Item>
              <Form.Item
                name={["msg2", "emoji"]}
                onChange={e => {
                  setFormValues({
                    ...formValues,
                    emoji2: e.target.value,
                  });
                }}
                style={{
                  display: "inline-block",
                  visibility: formValues["msg2"] === "gm" ? "hidden" : "visible",
                }}
              >
                <Input style={{ width: "140px" }} maxLength="5" placeholder="Enter 1 emoji" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item style={{ margin: 0 }}>
            <Input.Group>
              <Form.Item name={["msg3", "message"]} style={{ display: "inline-block" }}>
                <Select
                  placeholder="Message #3"
                  style={{ width: "200px", marginRight: "10px" }}
                  onChange={e => {
                    setFormValues({
                      ...formValues,
                      msg3: e,
                    });
                  }}
                >
                  <Select value="gm">gm</Select>
                  <Select value="I am...">I am...</Select>
                  <Select value="I feel...">I feel...</Select>
                  <Select value="I like...">I like...</Select>
                  <Select value="I want...">I want...</Select>
                  <Select value="I think...">I think...</Select>
                  <Select value="I do...">I do...</Select>
                  <Select value="I believe in...">I believe in...</Select>
                  <Select value="I build...">I build...</Select>
                </Select>
              </Form.Item>
              <Form.Item
                name={["msg3", "emoji"]}
                onChange={e => {
                  setFormValues({
                    ...formValues,
                    emoji3: e.target.value,
                  });
                }}
                style={{
                  display: "inline-block",
                  visibility: formValues["msg3"] === "gm" ? "hidden" : "visible",
                }}
              >
                <Input style={{ width: "140px" }} maxLength="5" placeholder="Enter 1 emoji" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item style={{ margin: 0 }}>
            <Input.Group>
              <Form.Item name={["msg4", "message"]} style={{ display: "inline-block" }}>
                <Select
                  placeholder="Message #4"
                  style={{ width: "200px", marginRight: "10px" }}
                  onChange={e => {
                    setFormValues({
                      ...formValues,
                      msg4: e,
                    });
                  }}
                >
                  <Select value="gm">gm</Select>
                  <Select value="I am...">I am...</Select>
                  <Select value="I feel...">I feel...</Select>
                  <Select value="I like...">I like...</Select>
                  <Select value="I want...">I want...</Select>
                  <Select value="I think...">I think...</Select>
                  <Select value="I do...">I do...</Select>
                  <Select value="I believe in...">I believe in...</Select>
                  <Select value="I build...">I build...</Select>
                </Select>
              </Form.Item>
              <Form.Item
                name={["msg4", "emoji"]}
                onChange={e => {
                  setFormValues({
                    ...formValues,
                    emoji4: e.target.value,
                  });
                }}
                style={{
                  display: "inline-block",
                  visibility: formValues["msg4"] === "gm" ? "hidden" : "visible",
                }}
              >
                <Input style={{ width: "140px" }} maxLength="5" placeholder="Enter 1 emoji" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item colon={false} style={{ margin: "0 auto", display: "inline-block", width: "100%" }}>
            <Button type="primary" htmlType="submit" style={{ margin: "0 auto", width: "100%" }}>
              Create your Emojiboard
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EmojiForm;
