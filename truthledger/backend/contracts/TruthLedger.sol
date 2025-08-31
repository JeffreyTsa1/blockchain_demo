// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TruthLedger {
    address public owner;
    modifier onlyOwner(){ require(msg.sender == owner, "Only owner"); _; }
    constructor(){ owner = msg.sender; }

    // internal credits to pay for edits
    mapping(address => uint256) public hashBalance;
    uint256 public constant EDIT_COST = 10;
    event HashAirdropped(address indexed to, uint256 amount);
    function airdropHash(address to, uint256 amount) external onlyOwner {
        hashBalance[to] += amount; emit HashAirdropped(to, amount);
    }

    // user profiles (≥3 inputs)
    struct UserProfile { bool exists; uint256 age; string location; string nationality; }
    mapping(address => UserProfile) public userProfiles;
    event UserUpdated(address indexed user, uint256 age, string location, string nationality);
    function setUserProfile(uint256 age, string calldata location, string calldata nationality) external {
        userProfiles[msg.sender] = UserProfile(true, age, location, nationality);
        emit UserUpdated(msg.sender, age, location, nationality);
    }

    // articles (content off-chain; ipfsHash on-chain)
    struct Revision { uint256 timestamp; string ipfsHash; address editor; uint256 cost; }
    struct Article {
        uint256 id; address author; string title; string category; string ipfsHash;
        string body; string[] tags; string sourceUrl; uint256 timestamp; bool retracted; int256 score;
    }
    uint256 public articleCounter;
    mapping(uint256 => Article) public articles;
    mapping(uint256 => Revision[]) public articleRevisions;
    uint256[] public articleIds;

    event ArticleSubmitted(uint256 indexed id, address indexed author, string title, string category, string ipfsHash, string body, string[] tags, string sourceUrl, uint256 timestamp);
    event ArticleEdited(uint256 indexed id, address indexed editor, string newIpfsHash, uint256 cost, uint256 timestamp);
    event ArticleRetracted(uint256 indexed id, address indexed by);

    function submitArticle(
        string calldata title, 
        string calldata category, 
        string calldata body,
        string[] calldata tags,
        string calldata sourceUrl
    ) external {
        require(bytes(title).length > 0, "Empty title");
        require(bytes(body).length > 0, "Empty body");
        articleCounter++;
        
        // Auto-generate IPFS hash using article counter and timestamp
        string memory autoIpfsHash = string(abi.encodePacked("Qm", uint2str(articleCounter), uint2str(block.timestamp)));
        
        articles[articleCounter] = Article({
            id: articleCounter, author: msg.sender, title: title, category: category,
            ipfsHash: autoIpfsHash, body: body, tags: tags, sourceUrl: sourceUrl,
            timestamp: block.timestamp, retracted: false, score: 0
        });
        articleIds.push(articleCounter);
        articleRevisions[articleCounter].push(Revision({timestamp:block.timestamp, ipfsHash:autoIpfsHash, editor:msg.sender, cost:0}));
        emit ArticleSubmitted(articleCounter, msg.sender, title, category, autoIpfsHash, body, tags, sourceUrl, block.timestamp);
    }
    function getArticleIdsLength() external view returns (uint256){ return articleIds.length; }

    function editArticle(uint256 articleId, string calldata newIpfsHash) external {
        require(articleId>0 && articleId<=articleCounter, "Invalid id");
        Article storage a = articles[articleId];
        require(!a.retracted, "Retracted");
        require(msg.sender == a.author, "Only author");
        require(bytes(newIpfsHash).length>0, "Empty IPFS");
        require(hashBalance[msg.sender] >= EDIT_COST, "Insufficient HASH");
        hashBalance[msg.sender] -= EDIT_COST;
        a.ipfsHash = newIpfsHash;
        articleRevisions[articleId].push(Revision({timestamp:block.timestamp, ipfsHash:newIpfsHash, editor:msg.sender, cost:EDIT_COST}));
        emit ArticleEdited(articleId, msg.sender, newIpfsHash, EDIT_COST, block.timestamp);
    }
    function retractArticle(uint256 articleId) external {
        require(articleId>0 && articleId<=articleCounter, "Invalid id");
        Article storage a = articles[articleId];
        require(msg.sender == a.author, "Only author");
        a.retracted = true;
        emit ArticleRetracted(articleId, msg.sender);
    }

    // votes (≥3rd data type)
    struct Vote { address voter; bool isCredible; string comment; uint256 timestamp; }
    mapping(uint256 => Vote[]) public votesByArticle;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    event Voted(uint256 indexed articleId, address indexed voter, bool isCredible, string comment, int256 newScore);
    function vote(uint256 articleId, bool isCredible, string calldata comment) external {
        require(articleId>0 && articleId<=articleCounter, "Invalid id");
        require(!hasVoted[articleId][msg.sender], "Already voted");
        Article storage a = articles[articleId]; require(!a.retracted, "Retracted");
        hasVoted[articleId][msg.sender] = true;
        votesByArticle[articleId].push(Vote({voter:msg.sender, isCredible:isCredible, comment:comment, timestamp:block.timestamp}));
        a.score += isCredible ? int256(1) : int256(-1);
        emit Voted(articleId, msg.sender, isCredible, comment, a.score);
    }

    // helpers
    function getRevisionCount(uint256 articleId) external view returns (uint256){ return articleRevisions[articleId].length; }
    function getVoteCount(uint256 articleId) external view returns (uint256){ return votesByArticle[articleId].length; }
    function getArticleTags(uint256 articleId) external view returns (string[] memory) {
        require(articleId > 0 && articleId <= articleCounter, "Invalid id");
        return articles[articleId].tags;
    }
    
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) { length++; j /= 10; }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) { bstr[--k] = bytes1(uint8(48 + j % 10)); j /= 10; }
        str = string(bstr);
    }
}
