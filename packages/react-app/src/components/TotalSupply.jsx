import React, { useEffect, useState } from "react";
import { Button } from "antd";

const MORALIS_API_KEY = process.env.REACT_APP_MORALIS_API_KEY;
const OPENSEA_CONTRACT_ADDRESS = process.env.REACT_APP_OPENSEA_CONTRACT_ADDRESS;

export default function TotalSupply() {
  const [totalSupply, setTotalSupply] = useState([]);

  // Get the last 5 emojiboards
  useEffect(() => {
    (async function () {
      try {
        // Get the last 5 emojiboards using Moralis API
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2/nft/${OPENSEA_CONTRACT_ADDRESS}?chain=rinkeby&format=decimal&limit=1`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": MORALIS_API_KEY,
            },
          },
        );
        const json = await response.json();
        console.log(json);
        // For each emojiboard, get the id and token_uri and set them as a pair in the emojiboards array
        setTotalSupply(json.total);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto 24px auto",
        padding: "4px",
        boxSizing: "border-box",
        lineHeight: "3rem",
        textAlign: "center",
        verticalAlign: "middle",
        fontSize: "1rem",
        fontWeight: 700,
        color: "#fff",
        display: "block",
        borderRadius: "8px",
        background: "rgb(155, 93, 230)",
        background: "linear-gradient(90deg, rgba(155,93,230,1) 0%, rgba(241,91,181,1) 100%)",
      }}
    >
      Emojiboards created so far: {totalSupply}
      <Button
        type="primary"
        key="loginbutton"
        style={{
          display: "inline-flex",
          verticalAlign: "top",
          marginTop: 4,
          marginLeft: "10px",
          backgroundColor: "#1e81e3",
          color: "#fff",
          fontWeight: 700,
          border: "1px solid #fff",
          padding: "6px 16px",
          borderRadius: "30px",
        }}
        shape="round"
        size="large"
        href="https://testnets.opensea.io/collection/emojiverse-v3"
        target={"_blank"}
      >
        OpenSea
      </Button>
    </div>
  );
}
