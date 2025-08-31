import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function ArticleModal({ article, isOpen, onClose, onVote }) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const getCategoryClass = (category) => {
    const categoryLower = category?.toLowerCase().replace(/\s+/g, '-');
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

  const handleVote = async (credible) => {
    await onVote(article.id, credible);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && article && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-article-id">#{article.id}</div>
                <button className="modal-close" onClick={onClose}>
                  <span>✕</span>
                </button>
              </div>
              <h2 className="modal-title">{article.title}</h2>
              <div className="modal-meta">
                <span className={`modal-category ${getCategoryClass(article.category)}`}>
                  {article.category}
                </span>
                <div className="modal-score-section">
                  <div className={`modal-score ${getScoreClass(article.score)}`}>
                    {article.score}
                  </div>
                  <span className="modal-score-label">Credibility Score</span>
                </div>
              </div>
            </div>

            <div className="modal-content">
              <div className="modal-section">
                <h4 className="modal-section-title">Author</h4>
                <div className="modal-author">{article.author}</div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Tags</h4>
                  <div className="modal-tags">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {article.sourceUrl && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Source</h4>
                  <div className="modal-source">
                    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="modal-source-link">
                      {article.sourceUrl}
                      <span className="modal-external-icon">🔗</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <h4 className="modal-section-title">IPFS Hash</h4>
                <div className="modal-ipfs">
                  <code>{article.ipfsHash}</code>
                  <button 
                    className="modal-copy-button"
                    onClick={() => navigator.clipboard.writeText(article.ipfsHash)}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>

              {article.body && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Content</h4>
                  <div className="modal-body">{article.body}</div>
                </div>
              )}
            </div>

            <motion.div 
              className="modal-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="vote-button vote-credible modal-vote-button"
                onClick={() => handleVote(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="vote-button-emoji">👍</span>
                Vote Credible
              </motion.button>
              <motion.button
                className="vote-button vote-not-credible modal-vote-button"
                onClick={() => handleVote(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="vote-button-emoji">👎</span>
                Vote Not Credible
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
