import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboardingState } from '../../hooks/useOnboardingState';
import OnboardingQuestion from '../OnboardingQuestion';

const OnboardingFlow = ({ isOpen, onComplete }) => {
  const {
    currentQuestion,
    currentAnswer,
    setCurrentAnswer,
    progress,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack,
  } = useOnboardingState({ onComplete });

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentQuestion.title}</DialogTitle>
        </DialogHeader>

        <Progress value={progress} className="mb-4" />

        <div className="py-4">
          <OnboardingQuestion
            question={currentQuestion}
            value={currentAnswer}
            onChange={setCurrentAnswer}
          />
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!currentAnswer}
              className={isFirstStep ? 'w-full' : ''}
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
