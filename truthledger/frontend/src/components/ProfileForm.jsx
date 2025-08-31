import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "../store";
import ProfileModal from "./ProfileModal";
import "./components.css";

export default function ProfileForm() {
  const { contract, account } = useApp();
  const [userProfile, setUserProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const loadProfile = async () => {
    if (!contract || !account) return;
    
    try {
      const profile = await contract.userProfiles(account);
      setUserProfile({
        exists: profile.exists,
        age: Number(profile.age),
        location: profile.location,
        nationality: profile.nationality,
      });

      // Show onboarding if profile doesn't exist
      if (!profile.exists) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [contract, account]);

  const handleProfileUpdate = () => {
    loadProfile();
    setShowOnboarding(false);
  };

  const openProfileModal = () => {
    setIsModalOpen(true);
    setShowOnboarding(false);
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <motion.div 
        className="profile-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="profile-connect">
          <h4>Connect Your Wallet</h4>
          <p>Please connect your wallet to view your profile</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="profile-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {showOnboarding && (
          <motion.div 
            className="onboarding-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="onboarding-content">
              <span className="onboarding-icon">👋</span>
              <div className="onboarding-text">
                <strong>Welcome!</strong> Complete your profile to get started.
              </div>
            </div>
            <button 
              className="onboarding-action"
              onClick={openProfileModal}
            >
              Complete Profile
            </button>
          </motion.div>
        )}

        <div className="profile-header-mini">
          <div className="profile-info">
            <div className="profile-avatar-small">👤</div>
            <div className="profile-details">
              <div className="profile-wallet">{formatAddress(account)}</div>
              {userProfile?.exists ? (
                <div className="profile-status">Profile Complete ✓</div>
              ) : (
                <div className="profile-status incomplete">Profile Incomplete</div>
              )}
            </div>
          </div>
          <motion.button
            className="profile-view-button"
            onClick={openProfileModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {userProfile?.exists ? "View Profile" : "Setup Profile"}
          </motion.button>
        </div>

        {userProfile?.exists && (
          <div className="profile-quick-info">
            <div className="quick-info-item">
              <span className="quick-info-label">Age:</span>
              <span className="quick-info-value">{userProfile.age}</span>
            </div>
            <div className="quick-info-item">
              <span className="quick-info-label">Location:</span>
              <span className="quick-info-value">{userProfile.location}</span>
            </div>
          </div>
        )}
      </motion.div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
}
