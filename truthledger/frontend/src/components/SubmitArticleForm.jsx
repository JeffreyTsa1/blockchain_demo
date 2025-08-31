import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../store";
import "./components.css";

export default function SubmitArticleForm() {
  const { contract } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Tech", "Health", "Science", "Business", "Politics", "Environment", "Education", "Finance",
    "Human Rights", "Freedom of Speech", "Social Justice", "Civil Rights", "Privacy Rights",
    "Other"
  ];

  const submit = async () => {
    if (!contract) return alert("Contract not ready");
    
    if (!title.trim()) return alert("Please enter a title");
    if (!body.trim()) return alert("Please enter article content");
    if (!category) return alert("Please select a category");
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      await (await contract.submitArticle(title, category, body, tagsArray, sourceUrl)).wait();
      
      // Reset form
      setTitle("");
      setCategory("");
      setBody("");
      setTags("");
      setSourceUrl("");
      
      alert("Article submitted successfully!");
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("Error submitting article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="submit-article-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-header">
        <h3 className="form-title">Submit New Article</h3>
        <p className="form-subtitle">Share your story with the blockchain community - IPFS hash will be auto-generated!</p>
      </div>

      <div className="form-content">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input 
              className="form-input"
              placeholder="Enter a compelling title for your article"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select 
              className="form-select"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Article Content *</label>
            <textarea 
              className="form-textarea"
              placeholder="Write your article content here..."
              value={body} 
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              maxLength={2000}
            />
            <div className="character-count">{body.length}/2000</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tags (Optional)</label>
            <input 
              className="form-input"
              placeholder="blockchain, technology, research"
              value={tags} 
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="form-hint">Separate tags with commas</div>
          </div>
          <div className="form-group">
            <label className="form-label">Source URL (Optional)</label>
            <input 
              className="form-input"
              placeholder="https://example.com/source"
              value={sourceUrl} 
              onChange={(e) => setSourceUrl(e.target.value)}
              type="url"
            />
          </div>
        </div>

        <motion.button 
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          onClick={submit}
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              <span className="submit-icon">📝</span>
              Submit Article
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
