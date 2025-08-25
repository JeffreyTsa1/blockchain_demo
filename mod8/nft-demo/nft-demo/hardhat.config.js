require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
paths: {
    artifacts: "./src/artifacts",
  },
        networks: {
                localhost: {
			url: "http://ec2-34-218-232-122.us-west-2.compute.amazonaws.com:8545"
            ,           chainID: 1337

                }
,
                hardhat: {
                        chainID: 1337
           }
   },
	solidity: "0.8.28",
};
