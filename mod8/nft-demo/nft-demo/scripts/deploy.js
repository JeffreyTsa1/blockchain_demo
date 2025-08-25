const hre = require("hardhat")

async function main() {
    const Color  = await hre.ethers.getContractFactory("Color");
    // deploy contracts
    const color  = await Color.deploy();
    await color.waitForDeployment();
    console.log("color deployed to: ", await color.getAddress());
    const contractAddress  = await color.getAddress();
    saveFrontendFiles(contractAddress  , "Color");
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
