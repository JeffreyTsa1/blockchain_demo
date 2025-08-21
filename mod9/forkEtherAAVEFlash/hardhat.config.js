require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
        networks: {
                hardhat: {
                localhost: {
                        url: "https://ec2-52-10-54-72.us-west-2.compute.amazonaws.com:8545"
,                       chainId: 31337
        
                }
,
                        forking: {
                        url: "https://cloudflare-eth.com/"
,                       chainId: 31337
                    }

                }
   },
	solidity: "0.8.10",
};
