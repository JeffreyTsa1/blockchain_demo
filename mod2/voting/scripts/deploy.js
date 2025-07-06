const hre = require("hardhat")
const web3 = require("web3")

async function main() {
    const VOTING  = await hre.ethers.getContractFactory("Voting");
    // deploy contracts
    const voting  = await VOTING.deploy();
    await voting.waitForDeployment();
    console.log("voting deployed to: ", await voting.getAddress());
    const contractAddress  = await voting.getAddress();
    saveFrontendFiles(contractAddress  , "Voting");
}

function saveFrontendFiles(contractAddress, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  
  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
