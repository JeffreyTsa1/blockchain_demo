pragma solidity ^0.8.9;

// Store a single data point and allow fetching/updating of that datapoint
contract Hello {

    // data point
    string public storedData;
    address public lastUpdater;
    event myEventTest(string eventOutput, address sender);

    function set(string memory myText) public {
        storedData = myText;
        lastUpdater = msg.sender;
        emit myEventTest(myText, msg.sender);
    }

    function get() public view returns (string memory) {
        return storedData;
    }

}

