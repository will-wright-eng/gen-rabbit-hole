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
import { Loader2 } from "lucide-react";

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
    isSubmitting,
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
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!currentAnswer || isSubmitting}
              className={isFirstStep ? 'w-full' : ''}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                isLastStep ? 'Get Started' : 'Next'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
