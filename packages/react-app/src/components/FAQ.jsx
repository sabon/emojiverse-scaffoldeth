import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const FAQ = () => {
  return (
    <div style={{ margin: "0 !important", padding: "1em 1em 4em 1em", backgroundColor: "#00F5D4" }}>
      <h3 className="h3-playful">FAQ</h3>
      <Collapse defaultActiveKey={["1"]} onChange={callback} style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Panel header="Summary" style={{ fontWeight: 700, textAlign: "left", backgroundColor: "#FEE440" }} key="1">
          <p style={{ fontWeight: 400 }}>
            Create your own NFT, with emoji-based messages. You have a set of messages to choose from and you can add
            one emoji to each one you choose. You can choose from 1 to 4 messages. Each message has a random background
            color and the emoji is rotated by a random number of degrees. Everything is kept fully on-chain. It will
            live as long as Ethereum.
          </p>
        </Panel>
        <Panel
          header="What does fully on-chain mean?"
          style={{ textAlign: "left", backgroundColor: "#FEE440" }}
          key="2"
        >
          <p>
            Many NFT projects aren't fully on-chain. For example, they will keep record of your token's mint, transfers
            and ownership on-chain, but the art will be kept on some server, controlled by somebody else, who can
            theoretically change or even delete it. Emojiverse is fully on-chain. All the art is generated as SVG and
            kept on Ethereum blockchain, not on any third party server. Your NFT will exist, unchanged, as long as
            Ethereum exists.
          </p>
        </Panel>
        <Panel header="Can I buy Emojiverse NFT?" style={{ textAlign: "left", backgroundColor: "#FEE440" }} key="3">
          <p>
            This is a learning, hobby project for me. I don't intend to start selling NFTs. You can "pretend buy" on
            Rinkeby test network, with "pretend ETH". You'll own it but won't have to pay for it. Great, isn't it?
          </p>
        </Panel>
        <Panel header="How to get ETH on Rinkeby?" style={{ textAlign: "left", backgroundColor: "#FEE440" }} key="4">
          <p>
            If you want to get the "pretend ETH" so that you can create and "pretend buy" your NFT, you can request test
            ETH on Rinkeby network here:{" "}
            <a target="_blank" href="https://www.rinkebyfaucet.com/" style={{ fontWeight: 700 }}>
              Rinkeby Faucet by Alchemy
            </a>
          </p>
        </Panel>
        <Panel
          header="How many Emojiverse NFTs can be minted?"
          style={{ textAlign: "left", backgroundColor: "#FEE440" }}
          key="5"
        >
          <p>There is no limit. No 1k, 2k or 10k total. Mint however many you want. It's all play anyway.</p>
        </Panel>
        <Panel
          header="Will Emojiverse be available on Ethereum mainnet?"
          style={{ textAlign: "left", backgroundColor: "#FEE440" }}
          key="6"
        >
          <p>I don't have such plans at the moment. But, you never know...</p>
        </Panel>
        <Panel header="Who is behind Emojiverse?" style={{ textAlign: "left", backgroundColor: "#FEE440" }} key="7">
          <p>
            Me,{" "}
            <a target="_blank" href="https://velvetshark.com/" style={{ fontWeight: 700 }}>
              Radek Sienkiewicz
            </a>
            . Conversion optimization / UX consultant, transitioning into web3 and loving it.
            <br />
            Twitter:{" "}
            <a target="_blank" href="https://twitter.com/sabon23" style={{ fontWeight: 700 }}>
              @sabon23
            </a>
          </p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default FAQ;
