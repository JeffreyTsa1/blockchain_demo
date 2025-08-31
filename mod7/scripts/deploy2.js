const hre = require("hardhat")

async function main() {
    const fundraiser  = await hre.ethers.getContractFactory("Fundraiser");
    // deploy contracts
    
const signers = await ethers.getSigners();
 const name =  "Beneficiary Name";
 const url = "beneficiaryname.org";
// const imageURL = "https://placekitten.com/600/350";
 const imageURL = "https://github.com/davidalfredostrowski/fundraiserfactory2_test/blob/main/src/artifacts/bunkieCoin3.png";




 const description = "Beneficiary description";
 const beneficiary = signers[1];
 const owner = signers[0];
 const fundr = await fundraiser.deploy(name,url,imageURL,description, beneficiary, owner);

    await fundr.waitForDeployment();
    console.log("fundraiser deployed to: ", await fundr.getAddress());
    const contractAddress  = await fundr.getAddress();
    console.log("fundraiser name:", await fundr.name());

	    saveFrontendFiles(contractAddress  , "Fundraiser");
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
