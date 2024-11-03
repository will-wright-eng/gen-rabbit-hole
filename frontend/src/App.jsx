import React, { useState, useEffect } from 'react';
import FlowCanvas from './features/flow/FlowCanvas';
import OnboardingFlow from './features/onboarding/OnboardingFlow';

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    // Check if user has completed onboarding before
    const savedPreferences = localStorage.getItem('userPreferences');
    if (!savedPreferences) {
      setShowOnboarding(true);
    } else {
      setUserPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleOnboardingComplete = (answers) => {
    setUserPreferences(answers);
    localStorage.setItem('userPreferences', JSON.stringify(answers));
    setShowOnboarding(false);
  };

  return (
    <div className="app-container">
      <FlowCanvas />
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default App;