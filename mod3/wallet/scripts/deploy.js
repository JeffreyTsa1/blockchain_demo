const hre = require("hardhat")
const web3 = require("web3")

async function main() {
    const Simple  = await hre.ethers.getContractFactory("SimpleStorage");
    // deploy contracts

    const simple  = await Simple.deploy();
    await simple.waitForDeployment();
    console.log("simple deployed to: ", await simple.getAddress());
    const contractAddress  = await simple.getAddress();
    saveFrontendFiles(contractAddress  , "SimpleStorage");
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
