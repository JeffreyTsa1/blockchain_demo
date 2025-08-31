import { useEffect, useState } from "react";
import { useApp } from "../store";
import ArticleModal from "./ArticleModal";
import "./components.css";

export default function ArticleList() {

  const { contract } = useApp();
  const [rows, setRows] = useState([
    { id: 1, title: "Sample Article", category: "Tech", ipfsHash: "Qm...", score: 5, author: "0x...", body: "This is a sample article." },
    { id: 2, title: "Another Article", category: "Health", ipfsHash: "Qn...", score: 3, author: "0x...", body: "This is another article." },
    { id: 3, title: "Third Article", category: "Science", ipfsHash: "Qo...", score: -1, author: "0x...", body: "This is the third article." },
    { id: 4, title: "Fourth Article", category: "Business", ipfsHash: "Qp...", score: 0, author: "0x...", body: "This is the fourth article." }
  ]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    if (!contract) return;
    const len = await contract.getArticleIdsLength();
    const arr = [];
    for (let i = 0; i < Number(len); i++) {
      const id = await contract.articleIds(i);
      const a = await contract.articles(id);
      const tags = await contract.getArticleTags(id);
      arr.push({
        id: Number(a.id),
        title: a.title,
        category: a.category,
        ipfsHash: a.ipfsHash,
        body: a.body,
        tags: tags,
        sourceUrl: a.sourceUrl,
        score: Number(a.score),
        author: a.author,
        timestamp: Number(a.timestamp),
        retracted: a.retracted,
      });
    }
    setRows(arr.reverse());
  };

  useEffect(() => { load(); }, [contract]);

  const vote = async (id, credible) => {
    const comment = window.prompt("Optional comment") || "";
    await (await contract.vote(id, credible, comment)).wait();
    await load();
  };

  const getCategoryClass = (category) => {
    const categoryLower = category.toLowerCase().replace(/\s+/g, '-');
    switch (categoryLower) {
      case 'tech':
        return 'category-tech';
      case 'health':
        return 'category-health';
      case 'science':
        return 'category-science';
      case 'business':
        return 'category-business';
      case 'human-rights':
        return 'category-human-rights';
      case 'freedom-of-speech':
        return 'category-freedom-of-speech';
      case 'social-justice':
        return 'category-social-justice';
      case 'civil-rights':
        return 'category-civil-rights';
      case 'privacy-rights':
        return 'category-privacy-rights';
      default:
        return 'category-default';
    }
  };

  const getScoreClass = (score) => {
    if (score > 0) return 'score-positive';
    if (score < 0) return 'score-negative';
    return 'score-neutral';
  };

  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="article-list">
      <h3 className="article-list-title">Articles</h3>
      {rows.length === 0 ? (
        <div className="article-list-empty">
          <div className="article-list-empty-icon">📄</div>
          <div className="article-list-empty-text">No articles yet</div>
          <div className="article-list-empty-subtext">Be the first to submit an article!</div>
        </div>
      ) : (
        <div className="article-container">
          {rows.map((a) => (
            <div 
              key={a.id} 
              className="article-card"
              onClick={() => openArticleModal(a)}
            >
              <div className="article-header">
                <div className="article-title-section">
                  <div className="article-id">#{a.id}</div>
                  <h4 className="article-title">{a.title}</h4>
                  <span className={`article-category ${getCategoryClass(a.category)}`}>
                    {a.category}
                  </span>
                </div>
                <div className="article-score-section">
                  <div className={`article-score ${getScoreClass(a.score)}`}>
                    {a.score}
                  </div>
                  <div className="score-label">Score</div>
                </div>
              </div>
              
              <div className="article-meta">
                <div className="article-ipfs-label">IPFS Hash</div>
                <div className="article-ipfs">{a.ipfsHash}</div>
              </div>
              
              <div className="article-actions">
                <button 
                  className="vote-button vote-credible"
                  onClick={(e) => {
                    e.stopPropagation();
                    vote(a.id, true);
                  }}
                >
                  <span className="vote-button-emoji">👍</span>
                  Credible
                </button>
                <button 
                  className="vote-button vote-not-credible"
                  onClick={(e) => {
                    e.stopPropagation();
                    vote(a.id, false);
                  }}
                >
                  <span className="vote-button-emoji">👎</span>
                  Not Credible
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={closeArticleModal}
        onVote={vote}
      />
    </div>
  );
}