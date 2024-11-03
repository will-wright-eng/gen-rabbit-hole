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
  const flowRef = React.useRef(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = () => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (!savedPreferences) {
      setShowOnboarding(true);
    } else {
      setUserPreferences(JSON.parse(savedPreferences));
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

  const handleResetFlow = () => {
    if (flowRef.current?.resetFlow) {
      flowRef.current.resetFlow();
      toast({
        title: "Flow Reset",
        description: "The flow has been reset to its initial state.",
      });
    }
  };

  return (
    <div className="app-container">
      <FlowCanvas ref={flowRef} />
      <SettingsMenu
        onResetOnboarding={handleResetOnboarding}
        onResetFlow={handleResetFlow}
      />
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      <Toaster />
    </div>
  );
};

export default App;
