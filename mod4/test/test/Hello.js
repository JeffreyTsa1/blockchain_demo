const { expect } = require("chai");



describe("Hello deployment", function () {
  it("Contract has been deployed successfully", async function () {
    const hardhatHello = await ethers.deployContract("Hello");
    expect(hardhatHello , "contract has been deployed");
  });
});

describe("Hello variable test", function() {
  it("contract variable set appropriately", async function() {
    const hardhatHello  = await ethers.deployContract("Hello");
    expect(await hardhatHello.storedData()).to.equal("Hello, World");
  });
});


describe("owner()", function(){
  it("returns the address of the owner", async function(){
          const hardhatHello = await ethers.deployContract("Hello");
          const contractAddress = await hardhatHello.address;
          const [deployer] = await ethers.getSigners();
          const owners = await ethers.getSigners();
          console.log("deployer", deployer);
          console.log("deployer.address",deployer.address);
          console.log("owners[0]", owners[0]);
          console.log("owners[0]".address, owners[0].address);
          expect(deployer).to.equal(deployer);
          expect(deployer.address).to.equal(hardhatHello.runner.address);
  });
});
describe("set hello!", function(){
  it("test my set function", async function(){
          const hardhatHello = await ethers.deployContract("Hello");
          await hardhatHello.set("Hello Again");
          expect(await hardhatHello.get()).to.equal("Hello Again");
  });

});

describe("set hello!", function(){
  it("test my set function", async function(){
          const hardhatHello = await ethers.deployContract("Hello");
          const owners = await ethers.getSigners();
          try {
              await hardhatHello.set("Hello Again",{ from: owners[0] } );
          }
          catch(err){
                const errM = "caller is not owner"
                expect(err).to.equal(errM)
                return;
          }
  });
});



describe("set hello! the right way", function(){
  it("test my set function", async function(){
          const hardhatHello = await ethers.deployContract("Hello");
          const owners = await ethers.getSigners();

          try {
              await hardhatHello.set("Hello Again",{ from: owners[0] } );
          }
          catch(err){
              const errM = "caller is not owner"
              expect(err).to.equal(errM)
              return;
          }
  });
});

describe("Event emission", function () {
  it("should emit myEventTest when set() is called", async function () {
    const hello = await ethers.deployContract("Hello");
    const testString = "Hello Again";

    await expect(hello.set(testString))
      .to.emit(hello, "myEventTest")
      .withArgs(testString);
  });
});
