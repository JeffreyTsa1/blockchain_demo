import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useApp } from "../store";

export default function ProfileModal({ isOpen, onClose, userProfile, onProfileUpdate }) {
  const { contract, account } = useApp();
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [nationality, setNationality] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with existing profile data
  useEffect(() => {
    if (userProfile && userProfile.exists) {
      setAge(userProfile.age.toString());
      setLocation(userProfile.location);
      setNationality(userProfile.nationality);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [userProfile]);

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

  const handleSubmit = async () => {
    if (!contract) return alert("Contract not ready");
    
    if (!age || !location || !nationality) {
      return alert("Please fill in all fields");
    }

    if (parseInt(age) < 13 || parseInt(age) > 120) {
      return alert("Please enter a valid age between 13 and 120");
    }

    setIsSubmitting(true);
    
    try {
      await (await contract.setUserProfile(parseInt(age), location, nationality)).wait();
      alert("Profile updated successfully!");
      onProfileUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container profile-modal"
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
            <div className="modal-header profile-header">
              <div className="modal-header-content">
                <div className="profile-avatar">👤</div>
                <button className="modal-close" onClick={onClose}>
                  <span>✕</span>
                </button>
              </div>
              <h2 className="modal-title">User Profile</h2>
              <div className="profile-address">
                Wallet: {formatAddress(account)}
              </div>
            </div>

            <div className="modal-content">
              {!isEditing && userProfile?.exists ? (
                // Display Mode
                <div className="profile-display">
                  <div className="profile-field">
                    <label className="profile-label">Age</label>
                    <div className="profile-value">{userProfile.age} years old</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Location</label>
                    <div className="profile-value">{userProfile.location}</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Nationality</label>
                    <div className="profile-value">{userProfile.nationality}</div>
                  </div>
                  
                  <motion.button
                    className="edit-profile-button"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="edit-icon">✏️</span>
                    Edit Profile
                  </motion.button>
                </div>
              ) : (
                // Edit Mode
                <div className="profile-edit">
                  {!userProfile?.exists && (
                    <div className="onboarding-message">
                      <h4>Welcome to TruthLedger! 👋</h4>
                      <p>Please complete your profile to start participating in our community.</p>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input 
                      className="form-input"
                      type="number"
                      placeholder="Enter your age"
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      min="13"
                      max="120"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location *</label>
                    <input 
                      className="form-input"
                      placeholder="e.g., New York, USA"
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nationality *</label>
                    <input 
                      className="form-input"
                      placeholder="e.g., American, British, etc."
                      value={nationality} 
                      onChange={(e) => setNationality(e.target.value)}
                      maxLength={50}
                    />
                  </div>

                  <div className="profile-actions">
                    <motion.button
                      className={`save-profile-button ${isSubmitting ? 'submitting' : ''}`}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading-spinner"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="save-icon">💾</span>
                          {userProfile?.exists ? 'Update Profile' : 'Complete Profile'}
                        </>
                      )}
                    </motion.button>
                    
                    {userProfile?.exists && (
                      <button
                        className="cancel-button"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
