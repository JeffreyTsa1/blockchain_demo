const hre = require("hardhat");   // ✅ you need this

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const TruthLedger = await hre.ethers.getContractFactory("TruthLedger");
  const contract = await TruthLedger.deploy();
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("TruthLedger deployed at:", addr);

  // optional: export ABI + address for frontend
  const fs = require("fs");
  const path = require("path");
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "TruthLedger.sol",
    "TruthLedger.json"
  );
  const abi = fs.readFileSync(artifactPath, "utf8");
  const frontDir = path.join(__dirname, "..", "..", "frontend", "src", "abi");
  fs.mkdirSync(frontDir, { recursive: true });
  fs.writeFileSync(path.join(frontDir, "TruthLedger.json"), abi);
  fs.writeFileSync(
    path.join(frontDir, "addresses.json"),
    JSON.stringify({ TruthLedger: addr }, null, 2)
  );
  console.log("ABI + address exported to frontend/src/abi/");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
