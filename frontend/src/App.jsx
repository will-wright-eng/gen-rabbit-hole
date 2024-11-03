import React from 'react';
import FlowCanvas from '@/features/flow/components/FlowCanvas';
import OnboardingFlow from '@/features/onboarding/components/OnboardingFlow';
import SettingsMenu from '@/components/ui/settings-menu';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from '@/hooks/useAppState';

const App = () => {
  const {
    showOnboarding,
    userPreferences,
    handleOnboardingComplete,
    handleResetOnboarding,
  } = useAppState();

  const { toast } = useToast();
  const flowRef = React.useRef(null);

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
