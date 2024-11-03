import React, { useState, useEffect } from 'react';
import FlowCanvas from './features/flow/FlowCanvas';
import OnboardingFlow from './features/onboarding/OnboardingFlow';
import SettingsMenu from './components/ui/settings-menu';
import { useOnboarding } from './hooks/useOnboarding';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const { resetOnboarding } = useOnboarding();
  const { toast } = useToast();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = () => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (!savedPreferences) {
      setShowOnboarding(true);
    } else {
      setUserPreferences(JSON.parse(savedPreferences));
      setShowOnboarding(false);
    }
  };

  const handleOnboardingComplete = (answers) => {
    setUserPreferences(answers);
    setShowOnboarding(false);
    toast({
      title: "Welcome!",
      description: `Great to have you here, ${answers.name}!`,
    });
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    setShowOnboarding(true);
    setUserPreferences(null);
    toast({
      title: "Onboarding Reset",
      description: "You can now go through the onboarding process again.",
    });
  };

  return (
    <div className="app-container">
      <FlowCanvas />
      <SettingsMenu onResetOnboarding={handleResetOnboarding} />
      <OnboardingFlow 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
      />
      <Toaster />
    </div>
  );
};

export default App;
