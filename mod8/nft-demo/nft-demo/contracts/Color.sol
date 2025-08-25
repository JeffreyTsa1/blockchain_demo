pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "./ERC721Full.sol";

contract Color is ERC721, Ownable {
  string[] public colors;
  mapping(string => bool) _colorExists;
 uint256 private _tokenIds;
 uint256 public totalSupply;


 constructor() ERC721("Color", "COLOR") public {
  }

  // E.G. color = "#FFFFFF"
  function mint(string memory _color) public {

    // require unique color
    require(!_colorExists[_color]);
    // Color - add it
    _tokenIds += 1;
    totalSupply += 1;


  colors.push(_color); 
    // Call the mint function    
    _mint(msg.sender, _tokenIds);
    // Color - track it
    _colorExists[_color] = true;
  }

}

