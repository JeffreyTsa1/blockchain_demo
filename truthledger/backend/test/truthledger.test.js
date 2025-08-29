const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TruthLedger", function () {
  let TL, ledger, owner, u1, u2, u3;

  const deploy = async () => {
    TL = await ethers.getContractFactory("TruthLedger");
    [owner, u1, u2, u3] = await ethers.getSigners();
    ledger = await TL.connect(owner).deploy();
    await ledger.waitForDeployment();
  };

  beforeEach(async () => {
    await deploy();
  });

  // ============ USER PROFILE ============
  it("sets & reads user profile", async () => {
    await expect(
      ledger.connect(u1).setUserProfile(30, "Chicago", "USA")
    )
      .to.emit(ledger, "UserUpdated")
      .withArgs(u1.address, 30, "Chicago", "USA");

    const prof = await ledger.userProfiles(u1.address);
    expect(prof.exists).to.equal(true);
    expect(prof.age).to.equal(30);
    expect(prof.location).to.equal("Chicago");
    expect(prof.nationality).to.equal("USA");
  });

  // ============ ARTICLE SUBMISSION ============
  it("submits article and tracks ids + initial revision", async () => {
    await expect(
      ledger.connect(u1).submitArticle("Title A", "HumanRights", "QmHashA")
    )
      .to.emit(ledger, "ArticleSubmitted")
      .withArgs(1, u1.address, "Title A", "HumanRights", "QmHashA", anyUint());

    // list length
    const len = await ledger.getArticleIdsLength();
    expect(len).to.equal(1);

    // article content
    const a = await ledger.articles(1);
    expect(a.id).to.equal(1);
    expect(a.author).to.equal(u1.address);
    expect(a.title).to.equal("Title A");
    expect(a.category).to.equal("HumanRights");
    expect(a.ipfsHash).to.equal("QmHashA");
    expect(a.retracted).to.equal(false);
    expect(a.score).to.equal(0);

    // initial revision present
    const revCount = await ledger.getRevisionCount(1);
    expect(revCount).to.equal(1);
  });

  it("rejects empty title or empty IPFS", async () => {
    await expect(
      ledger.connect(u1).submitArticle("", "Cat", "QmX")
    ).to.be.revertedWith("Empty title");

    await expect(
      ledger.connect(u1).submitArticle("T", "Cat", "")
    ).to.be.revertedWith("Empty IPFS");
  });

  // ============ VOTING ============
  it("votes once, updates score, stores comment, emits event", async () => {
    await ledger.connect(u1).submitArticle("T", "Cat", "QmX");

    await expect(ledger.connect(u2).vote(1, true, "credible"))
      .to.emit(ledger, "Voted")
      .withArgs(1, u2.address, true, "credible", 1);

    const a = await ledger.articles(1);
    expect(a.score).to.equal(1);

    const voteCount = await ledger.getVoteCount(1);
    expect(voteCount).to.equal(1);

    await expect(
      ledger.connect(u2).vote(1, false, "second time")
    ).to.be.revertedWith("Already voted");
  });

  it("cannot vote on invalid id or retracted article", async () => {
    await ledger.connect(u1).submitArticle("T", "Cat", "QmX");
    await expect(
      ledger.connect(u2).vote(999, true, "nope")
    ).to.be.revertedWith("Invalid id");

    await ledger.connect(u1).retractArticle(1);
    await expect(
      ledger.connect(u2).vote(1, true, "after retract")
    ).to.be.revertedWith("Retracted");
  });

  // ============ EDITS (HASH cost) ============
  it("author edits by spending HASH and appends revision", async () => {
    // seed HASH
    await ledger.connect(owner).airdropHash(u1.address, 100);

    await ledger.connect(u1).submitArticle("T", "Cat", "QmX");
    const before = await ledger.hashBalance(u1.address);

    await expect(ledger.connect(u1).editArticle(1, "QmNew"))
      .to.emit(ledger, "ArticleEdited")
      .withArgs(1, u1.address, "QmNew", 10, anyUint());

    const after = await ledger.hashBalance(u1.address);
	  // Option A
    const cost = await ledger.EDIT_COST();
    expect(before - after).to.equal(cost);

    const a = await ledger.articles(1);
    expect(a.ipfsHash).to.equal("QmNew");

    const revCount = await ledger.getRevisionCount(1);
    expect(revCount).to.equal(2); // initial + edit
  });

  it("rejects edit when not author, empty IPFS, invalid id, or no HASH", async () => {
    await ledger.connect(owner).airdropHash(u1.address, 5); // less than EDIT_COST(10)
    await ledger.connect(u1).submitArticle("T", "Cat", "QmX");

    await expect(
      ledger.connect(u2).editArticle(1, "QmNew")
    ).to.be.revertedWith("Only author");

    await expect(
      ledger.connect(u1).editArticle(999, "QmNew")
    ).to.be.revertedWith("Invalid id");

    await expect(
      ledger.connect(u1).editArticle(1, "")
    ).to.be.revertedWith("Empty IPFS");

    await expect(
      ledger.connect(u1).editArticle(1, "QmNew")
    ).to.be.revertedWith("Insufficient HASH");
  });

  it("cannot edit a retracted article", async () => {
    await ledger.connect(owner).airdropHash(u1.address, 100);
    await ledger.connect(u1).submitArticle("T", "Cat", "QmX");
    await ledger.connect(u1).retractArticle(1);
    await expect(
      ledger.connect(u1).editArticle(1, "QmNew")
    ).to.be.revertedWith("Retracted");
  });

  // ============ RETRACTION ============
  it("author retracts article; only author can retract", async () => {
    await ledger.connect(u1).submitArticle("T", "Cat", "QmX");

    await expect(ledger.connect(u2).retractArticle(1))
      .to.be.revertedWith("Only author");

    await expect(ledger.connect(u1).retractArticle(1))
      .to.emit(ledger, "ArticleRetracted")
      .withArgs(1, u1.address);

    const a = await ledger.articles(1);
    expect(a.retracted).to.equal(true);
  });

  // ============ ADMIN / HASH ============
  it("owner airdrops HASH", async () => {
    await expect(ledger.connect(owner).airdropHash(u1.address, 77))
      .to.emit(ledger, "HashAirdropped")
      .withArgs(u1.address, 77);

    const bal = await ledger.hashBalance(u1.address);
    expect(bal).to.equal(77);

    await expect(
      ledger.connect(u1).airdropHash(u2.address, 10)
    ).to.be.revertedWith("Only owner");
  });
});

/** Helper matcher for timestamp-like values */
function anyUint() {
  return (value) => typeof value === "bigint" || typeof value === "number";
}
