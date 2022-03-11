//SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

/***
 *    oooooooooooo                                 o8o  o8o
 *    `888'     `8                                 `"'  `"'
 *     888         ooo. .oo.  .oo.    .ooooo.     oooo oooo  oooo    ooo  .ooooo.  oooo d8b  .oooo.o  .ooooo.
 *     888oooo8    `888P"Y88bP"Y88b  d88' `88b    `888 `888   `88.  .8'  d88' `88b `888""8P d88(  "8 d88' `88b
 *     888    "     888   888   888  888   888     888  888    `88..8'   888ooo888  888     `"Y88b.  888ooo888
 *     888       o  888   888   888  888   888     888  888     `888'    888    .o  888     o.  )88b 888    .o
 *    o888ooooood8 o888o o888o o888o `Y8bod8P'     888 o888o     `8'     `Y8bod8P' d888b    8""888P' `Y8bod8P'
 *                                                 888
 *                                             .o. 88P
 *                                             `Y888P
 */

// @title    Emojiverse
// @version  1.0.0
// @author   Radek Sienkiewicz | velvetshark.com

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { Base64 } from "./libraries/Base64.sol";

contract Emojiverse is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  // Stores the number of tokens
  Counters.Counter private _tokenIds;
  // Stores the number of bytes to shift in a pseudo random number
  Counters.Counter private _randShift;

  // Setting the price to free
  uint256 public mintPrice = 0 ether;

  // Stores background colors to choose from when minting
  string[] private backgroundColors = [
    "rgb(1, 138, 178)",
    "rgb(104, 203, 171)",
    "rgb(110, 60, 188)",
    "rgb(114, 103, 203)",
    "rgb(118, 255, 226)",
    "rgb(119, 228, 212)",
    "rgb(152, 186, 231)",
    "rgb(153, 118, 255)",
    "rgb(153, 140, 235)",
    "rgb(157, 225, 22)",
    "rgb(158, 126, 93)",
    "rgb(168, 236, 231)",
    "rgb(176, 0, 185)",
    "rgb(178, 234, 112)",
    "rgb(180, 254, 152)",
    "rgb(180, 255, 199)",
    "rgb(182, 238, 170)",
    "rgb(187, 255, 159)",
    "rgb(194, 81, 237)",
    "rgb(199, 46, 65)",
    "rgb(200, 92, 92)",
    "rgb(203, 173, 255)",
    "rgb(207, 241, 205)",
    "rgb(209, 232, 228)",
    "rgb(212, 122, 232)",
    "rgb(221, 74, 72)",
    "rgb(226, 106, 44)",
    "rgb(229, 137, 10)",
    "rgb(236, 37, 90)",
    "rgb(237, 237, 237)",
    "rgb(240, 187, 98)",
    "rgb(240, 40, 252)",
    "rgb(246, 217, 197)",
    "rgb(249, 151, 93)",
    "rgb(249, 207, 242)",
    "rgb(251, 209, 72)",
    "rgb(251, 244, 109)",
    "rgb(251, 255, 0)",
    "rgb(252, 101, 97)",
    "rgb(252, 174, 223)",
    "rgb(253, 255, 143)",
    "rgb(254, 203, 227)",
    "rgb(255, 0, 0)",
    "rgb(255, 114, 120)",
    "rgb(255, 139, 162)",
    "rgb(255, 144, 54)",
    "rgb(255, 171, 76)",
    "rgb(255, 183, 110)",
    "rgb(255, 208, 127)",
    "rgb(255, 22, 147)",
    "rgb(255, 231, 128)",
    "rgb(255, 81, 81)",
    "rgb(255, 95, 126)",
    "rgb(46, 130, 255)",
    "rgb(52, 49, 108)",
    "rgb(57, 61, 124)",
    "rgb(6, 72, 122)",
    "rgb(65, 62, 83)",
    "rgb(73, 255, 0)",
    "rgb(81, 146, 89)",
    "rgb(84, 63, 88)",
    "rgb(86, 123, 130)",
    "rgb(87, 205, 229)",
    "rgb(93, 211, 255)"
  ];

  // Events
  event CreatedEmojiboard(uint256 indexed tokenId, string tokenURI);

  // mapping(uint256 => Emojiboard) private idToEmojiboard;

  constructor() ERC721("Emojiverse", "EMJV") {
    console.log("Emojiverse");

    // Increment tokenIds so that the first NFT has an ID of 1
    _tokenIds.increment();
  }

  // Get the number of emojiboards minted
  function totalSupply() public view returns (uint256) {
    return _tokenIds.current() - 1;
  }

  // An option to change the price in the future
  function setMintPrice(uint256 newMintPrice) external onlyOwner {
    mintPrice = newMintPrice;
  }

  // Users would be able to hit this function and get their NFT based on the parameters they have chosen
  function mintEmojiverseNFT(string[] memory _emojis, string[] memory _messages) public payable {
    require(msg.value >= mintPrice, "Wrong amount of ETH sent.");

    // Get current tokenId (starts at 1 since it was incremented in the constructor)
    uint256 newItemId = _tokenIds.current();

    // If there's only one emoji, don't wrap it in outer svg code. If there's more, add the encompassing svg code.
    string memory svg = _emojis.length == 1
      ? generateInnerSVG(_emojis, _messages)
      : generateFinalSVG(generateInnerSVG(_emojis, _messages)); // Change to generateFinalSVG()

    string memory svgURI = formatTokenURI(svg);

    // Assign the tokenId to the caller's wallet address.
    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, svgURI);

    console.log("\n----- Final token URI -----");
    console.log(svgURI);
    console.log("---------------------------\n");
    console.log(_randShift.current());

    // Increment the tokenId for the next person that uses it
    _tokenIds.increment();
    // Reset the random shift so that the next mint it starts at zero again
    _randShift.reset();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    emit CreatedEmojiboard(newItemId, svgURI);
  }

  // Generate inner SVG based on the emojis and messages
  function generateInnerSVG(string[] memory _emojis, string[] memory _messages)
    private
    returns (string memory innerSvg)
  {
    console.log("Generating SVG");
    console.log("Number of messages:", _messages.length);

    // Pseudo-random number generator
    uint256 _randomBase = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), _tokenIds.current())));

    // Generate the SVG
    // If there's only one emoji - create one big square
    if (_emojis.length == 1) {
      string[2] memory final_message1 = final_message(_emojis[0], _messages[0]);
      string memory message_1 = generateSvgSquare(final_message1[0], final_message1[1], 4, "0", "0", _randomBase);

      console.log(string(abi.encodePacked(message_1)));

      return string(abi.encodePacked(message_1));

      // If two emojis - create two halves
    } else if (_emojis.length == 2) {
      // First part
      string[2] memory final_message1 = final_message(_emojis[0], _messages[0]);
      // Generate a part of an SVG. Pass the emoji, the message, the number of squares to generate, and x and y coordinates
      string memory message_1 = generateSvgSquare(final_message1[0], final_message1[1], 2, "0", "0", _randomBase);

      // Second part
      string[2] memory final_message2 = final_message(_emojis[1], _messages[1]);
      string memory message_2 = generateSvgSquare(final_message2[0], final_message2[1], 2, "0", "400", _randomBase);

      console.log(string(abi.encodePacked(message_1, message_2)));

      return string(abi.encodePacked(message_1, message_2));

      // Three emojis - one half and two small squares
    } else if (_emojis.length == 3) {
      // First part
      string[2] memory final_message1 = final_message(_emojis[0], _messages[0]);
      // Generate a part of an SVG. Pass the emoji, the message, the number of squares to generate, and x and y coordinates
      string memory message_1 = generateSvgSquare(final_message1[0], final_message1[1], 2, "0", "0", _randomBase);

      // Second part
      string[2] memory final_message2 = final_message(_emojis[1], _messages[1]);
      string memory message_2 = generateSvgSquare(final_message2[0], final_message2[1], 1, "0", "400", _randomBase);

      // Third part
      string[2] memory final_message3 = final_message(_emojis[2], _messages[2]);
      string memory message_3 = generateSvgSquare(final_message3[0], final_message3[1], 1, "400", "400", _randomBase);

      console.log(string(abi.encodePacked(message_1, message_2, message_3)));

      return string(abi.encodePacked(message_1, message_2, message_3));

      // Four emojis - four small squares
    } else if (_emojis.length == 4) {
      // First part
      string[2] memory final_message1 = final_message(_emojis[0], _messages[0]);
      string memory message_1 = generateSvgSquare(final_message1[0], final_message1[1], 1, "0", "0", _randomBase);

      // Second part
      string[2] memory final_message2 = final_message(_emojis[1], _messages[1]);
      string memory message_2 = generateSvgSquare(final_message2[0], final_message2[1], 1, "400", "0", _randomBase);

      // Third part
      string[2] memory final_message3 = final_message(_emojis[2], _messages[2]);
      string memory message_3 = generateSvgSquare(final_message3[0], final_message3[1], 1, "0", "400", _randomBase);

      // Fourth part
      string[2] memory final_message4 = final_message(_emojis[3], _messages[3]);
      string memory message_4 = generateSvgSquare(final_message4[0], final_message4[1], 1, "400", "400", _randomBase);

      console.log(string(abi.encodePacked(message_1, message_2, message_3, message_4)));

      return string(abi.encodePacked(message_1, message_2, message_3, message_4));
    }
  }

  // Generate final SVG by adding encompassing svg code
  function generateFinalSVG(string memory innerSVG) internal returns (string memory finalSvg) {
    string
      memory svg_first_part = "<svg width='800' height='800' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'>";
    string memory svg_last_part = "</svg>";
    return string(abi.encodePacked(svg_first_part, innerSVG, svg_last_part));
  }

  function final_message(string memory _emoji, string memory _message) internal pure returns (string[2] memory) {
    // Check if message is "gm". If it is, return message "My message to the world". Otherwise, return the message passed as a parameter.
    // If the message is "gm", return "gm". Otherwise, return the emoji.
    if (keccak256(abi.encodePacked(_message)) == keccak256(abi.encodePacked("gm"))) {
      _message = "My message to the world...";
      _emoji = "gm";
    }
    return [_emoji, _message];
  }

  // Third parameter - how big the container should be. 1 = small square (400x400), 2 = double square (800x400), 4 = large square (800x800)
  function generateSvgSquare(
    string memory _emoji,
    string memory _message,
    uint8 _squares,
    string memory _x,
    string memory _y,
    uint256 _randomBase
  ) internal returns (string memory) {
    // Breaking up the function into 3 parts to avoid "stack too deep" errors
    bytes memory _svgcode1 = generateSvgSquare_part1(_squares, _x, _y);
    bytes memory _svgcode2 = generateSvgSquare_part2(_emoji, _message, _squares, _randomBase);
    bytes memory _svgcode3 = generateSvgSquare_part3(_emoji, _message, _squares, _randomBase);

    return string(abi.encodePacked(_svgcode1, _svgcode2, _svgcode3));
  }

  function generateSvgSquare_part1(
    uint8 _squares,
    string memory _x,
    string memory _y
  ) internal pure returns (bytes memory) {
    string memory wide800 = uint2str(_squares == 1 ? 400 : 800);
    string memory narrow400 = uint2str(_squares == 4 ? 800 : 400);

    bytes memory _svgcode = abi.encodePacked(
      "<svg x='",
      _x,
      "' y='",
      _y,
      "' width='",
      wide800,
      "' height='",
      narrow400,
      "' viewBox='0 0 ",
      wide800,
      " ",
      narrow400,
      "' xmlns='http://www.w3.org/2000/svg'><rect width='",
      wide800,
      "' height='",
      narrow400
    );
    return _svgcode;
  }

  function generateSvgSquare_part2(
    string memory _emoji,
    string memory _message,
    uint8 _squares,
    uint256 _randomBase
  ) internal returns (bytes memory) {
    bytes memory _svgcode = abi.encodePacked(
      "' style='fill:",
      backgroundColors[pseudoRandom(_randomBase, uint16(backgroundColors.length))], // Choose random color from backgroundColors array
      ";' />",
      "<text x='5%' y='",
      uint2str(_squares == 4 ? 8 : 14),
      "%' font-size='",
      font_size(_squares),
      "' font-family='Monospace, Helvetica, sans-serif'>",
      _message,
      "</text><text x='50%' y='",
      vertical_offset(_squares, _emoji),
      "' dominant-baseline='middle' font-family='Monospace, Helvetica, sans-serif' text-anchor='middle' font-size='",
      emoji_size(_squares, _emoji),
      "' transform='rotate("
    );
    return _svgcode;
  }

  function generateSvgSquare_part3(
    string memory _emoji,
    string memory _message,
    uint8 _squares,
    uint256 _randomBase
  ) internal returns (bytes memory) {
    string memory wide400 = uint2str(_squares == 1 ? 200 : 400);
    string memory narrow200 = uint2str(_squares == 4 ? 400 : 200);

    bytes memory _svgcode = abi.encodePacked(
      pseudoRandom(_randomBase, 100) % 2 == 0 ? "" : "-", // Randomly flip the + or - sign,
      uint2str(pseudoRandom(_randomBase, 120)), // Random value from 0 to 120
      " ",
      wide400,
      ",",
      narrow200,
      ")'>",
      _emoji,
      "</text></svg>"
    );
    return _svgcode;
  }

  function formatTokenURI(string memory SvgURI) private pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                "Emojiverse",
                '", "description":"An emoji-based NFT!", "attributes":"", "image":"data:image/svg+xml;base64,',
                Base64.encode(bytes(SvgURI)),
                '"}'
              )
            )
          )
        )
      );
  }

  // // Pseudo-random number generator
  // uint256 _randomBase = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), _tokenIds.current())));

  // Based on one generated pseudo random number (_randomBase), generate a pseudo random number between 0 and _max by shifting _randomBase by one byte
  function pseudoRandom(uint256 _randomBase, uint16 _max) private returns (uint256) {
    // Increment the counter so that it increases each time the function is called. This way, each function call gives a different number.
    _randShift.increment();
    return uint16(_randomBase >> _randShift.current()) % _max;
  }

  function font_size(uint8 _squares) internal pure returns (string memory) {
    if (_squares == 1) {
      return "22px";
    } else if (_squares == 2) {
      return "30px";
    } else {
      return "42px";
    }
  }

  function emoji_size(uint8 _squares, string memory _emoji) internal pure returns (string memory) {
    if (_squares == 1) {
      return "120px";
    } else if (_squares == 2) {
      return (keccak256(abi.encodePacked(_emoji)) == keccak256(abi.encodePacked("gm"))) ? "180px" : "140px";
    } else {
      // 4 squares
      return (keccak256(abi.encodePacked(_emoji)) == keccak256(abi.encodePacked("gm"))) ? "380px" : "180px";
    }
  }

  function vertical_offset(uint8 _squares, string memory _emoji) internal pure returns (string memory) {
    if ((_squares == 1) || (_squares == 2)) {
      return (keccak256(abi.encodePacked(_emoji)) == keccak256(abi.encodePacked("gm"))) ? "50%" : "60%";
    } else if (_squares == 4) {
      return (keccak256(abi.encodePacked(_emoji)) == keccak256(abi.encodePacked("gm"))) ? "50%" : "60%";
    } else if (_squares == 2) {
      return "50%";
    } else {
      return "50%";
    }
  }

  // From: https://stackoverflow.com/a/65707309/11969592
  function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
    if (_i == 0) {
      return "0";
    }
    uint256 j = _i;
    uint256 len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint256 k = len;
    while (_i != 0) {
      k = k - 1;
      uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      _i /= 10;
    }
    return string(bstr);
  }

  function withdraw() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
  }
}
