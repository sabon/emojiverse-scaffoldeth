import React, { useEffect, useState } from "react";
import { Image } from "antd";
import TotalSupply from "./TotalSupply";

const MORALIS_API_KEY = process.env.REACT_APP_MORALIS_API_KEY;
const OPENSEA_CONTRACT_ADDRESS = process.env.REACT_APP_OPENSEA_CONTRACT_ADDRESS;

export default function Emojiboards(account) {
  // A state variable to store created Emojiboards
  const [emojiboards, setEmojiboards] = useState([]);
  const [userEmojiboards, setUserEmojiboards] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(account.account);

  function extractImage(uri) {
    // Starting with character 30 because each uri start with this: "data:application/json;base64,"
    return uri ? JSON.parse(Buffer.from(uri.substring(29), "base64")).image : "";
  }

  // Get the last 5 emojiboards
  useEffect(() => {
    (async function () {
      try {
        // Get the last 5 emojiboards using Moralis API
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2/nft/${OPENSEA_CONTRACT_ADDRESS}?chain=rinkeby&format=decimal&limit=8`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": MORALIS_API_KEY,
            },
          },
        );
        const json = await response.json();
        // For each emojiboard, get the id and token_uri and set them as a pair in the emojiboards array
        setEmojiboards(json.result.map(emojiboard => [emojiboard.token_id, emojiboard.token_uri]));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Get current user's emojiboards
  useEffect(() => {
    (async function () {
      try {
        // Get user's emojiboards using Moralis API
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2/${currentAccount}/nft/${OPENSEA_CONTRACT_ADDRESS}?chain=rinkeby&format=decimal&limit=100`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": MORALIS_API_KEY,
            },
          },
        );
        const json = await response.json();
        // Sort the user's emojiboards by id, descending
        json.result.sort((a, b) => b.token_id - a.token_id);
        // For each emojiboard, get the id and token_uri and set them as a pair in the emojiboards array
        setUserEmojiboards(json.result.map(emojiboard => [emojiboard.token_id, emojiboard.token_uri]));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentAccount]);

  return (
    <div style={{ margin: "0px !important", padding: "10px 10px 30px 10px", backgroundColor: "#00BBF9" }}>
      <h3 className="h3-playful">Recent Emojiboards</h3>
      <Image.PreviewGroup style={{ marginBottom: "50px" }}>
        {emojiboards &&
          emojiboards.length > 0 &&
          emojiboards.map(emojiboard => (
            <div style={{ display: "inline-block", marginBottom: "30px" }}>
              <Image className="img-shadow" src={extractImage(emojiboard[1])} alt={emojiboard[0]} />
              <br />
              Emojiboard #{emojiboard[0]}
              <br />
              <a
                href={`https://rinkeby.opensea.io/assets/${OPENSEA_CONTRACT_ADDRESS}/${emojiboard[0]}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", fontWeight: "normal" }}
              >
                Check on OpenSea
              </a>
              <br />
            </div>
          ))}
      </Image.PreviewGroup>
      <TotalSupply />
    </div>
  );
  // <Box sx={{ margin: "0px !important", padding: "0px !important" }}>
  //   <Box sx={{ margin: "0px !important", padding: "0px !important" }}>
  //     {userEmojiboards.length > 0 && (
  //       <Box sx={{ backgroundColor: "#00F5D4", padding: "15px" }}>
  //         <Typography
  //           className="h3-playful"
  //           sx={{
  //             lineHeight: 0.8,
  //             textShadow: "-0.04em 0.04em 0 #ffffff",
  //             fontWeight: 700,
  //             padding: "0.4em 0.6em",
  //           }}
  //         >
  //           Your Emojiboards ({userEmojiboards.length})
  //         </Typography>
  //         <Typography sx={{ mt: 5, mb: 3, fontWeight: "700" }} color="text.secondary">
  //           <ImageList sx={{ width: "100%", padding: "5px" }} gap={20}>
  //             {userEmojiboards &&
  //               userEmojiboards.length > 0 &&
  //               userEmojiboards.map(emojiboard => (
  //                 <ImageListItem key={emojiboard[0]}>
  //                   <img
  //                     src={extractImage(emojiboard[1])}
  //                     alt={emojiboard[0]}
  //                     loading="lazy"
  //                     className="img-shadow"
  //                   />

  //                   <ImageListItemBar
  //                     title={`Emojiboard #${emojiboard[0]}`}
  //                     subtitle={
  //                       <Link
  //                         target="_blank"
  //                         href={`https://rinkeby.opensea.io/assets/${OPENSEA_CONTRACT_ADDRESS}/${emojiboard[0]}`}
  //                         style={{ color: "#fff", fontWeight: "normal" }}
  //                       >
  //                         Check on OpenSea
  //                       </Link>
  //                     }
  //                     position="below"
  //                   />
  //                 </ImageListItem>
  //               ))}
  //           </ImageList>
  //         </Typography>
  //       </Box>
  //     )}
  //   </Box>
  //   <Box sx={{ margin: "0 !important", padding: "10px !important", backgroundColor: "#00BBF9" }}>
  //     <Typography sx={{ mt: 2, mb: 3 }} color="text.secondary">
  //       <Typography className="h3-playful">Recent Emojiboards</Typography>
  //       <ImageList sx={{ width: "100%", padding: "5px" }} cols={4} gap={20}>
  //         {emojiboards &&
  //           emojiboards.length > 0 &&
  //           emojiboards.map(emojiboard => (
  //             <ImageListItem key={emojiboard[0]}>
  //               <img src={extractImage(emojiboard[1])} alt={emojiboard[0]} loading="lazy" className="img-shadow" />
  //               <ImageListItemBar
  //                 title={`Emojiboard #${emojiboard[0]}`}
  //                 subtitle={
  //                   <Link
  //                     target="_blank"
  //                     href={`https://rinkeby.opensea.io/assets/${OPENSEA_CONTRACT_ADDRESS}/${emojiboard[0]}`}
  //                     style={{ color: "#fff", fontWeight: "normal" }}
  //                   >
  //                     Check on OpenSea
  //                   </Link>
  //                 }
  //                 position="below"
  //               />
  //             </ImageListItem>
  //           ))}
  //       </ImageList>
  //       <TotalSupply />
  //     </Typography>
  //   </Box>
  // </Box>
}
