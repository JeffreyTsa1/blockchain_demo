const { expect } = require("chai");



describe("Voting deployment", function () {
  it("Contract has been deployed successfully", async function () {
    const hardhatVoting = await ethers.deployContract("Voting");
    expect(hardhatVoting , "contract has been deployed");
  });
});


describe("Voting variable test", function() {
  it("contract variables set appropriately", async function() {
    const hardhatVoting  = await ethers.deployContract("Voting");
    expect(await hardhatVoting.candidateList(0)).to.equal("Johnny");
  });
});

describe("Voting variable test", function() {
  it("contract variables set appropriately", async function() {
    const hardhatVoting  = await ethers.deployContract("Voting");
    expect(await hardhatVoting.candidateList(1)).to.equal("Amber");
  });
});

describe("owner()", function(){
  it("returns the address of the owner", async function(){
          const hardhatVoting = await ethers.deployContract("Voting");
          const contractAddress = await hardhatVoting.address;
          const [deployer] = await ethers.getSigners();
          const owners = await ethers.getSigners();
          console.log("deployer", deployer);
          console.log("deployer.address",deployer.address);
          console.log("owners[0]", owners[0]);
          console.log("owners[0]".address, owners[0].address);
          expect(deployer).to.equal(deployer);
          expect(deployer.address).to.equal(hardhatVoting.runner.address);
  });
});



describe("vote For Johnny", function(){
  it("test my vote function", async function(){
          const hardhatVote = await ethers.deployContract("Voting");
          var voteCount = await hardhatVote.votesReceived("Johnny") 
	  console.log(voteCount)
	  voteCount = voteCount + BigInt(1)
	  await hardhatVote.voteForCandidate("Johnny");
          var  voteCountPlusOne = await hardhatVote.votesReceived("Johnny")
          console.log(voteCountPlusOne)
	  expect(voteCountPlusOne).to.equal(voteCount);
  });

});





