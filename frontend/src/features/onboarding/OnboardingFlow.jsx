import React, { useState } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const OnboardingFlow = ({ isOpen, onComplete }) => {
  const { submitOnboarding, error, isLoading, questions } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleNext = () => {
    if (!currentAnswer) return;

    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: currentAnswer
    }));

    if (currentStep === questions.length - 1) {
      onComplete(answers);
    } else {
      setCurrentStep(prev => prev + 1);
      setCurrentAnswer('');
    }
  };

  const handleOptionSelect = (option) => {
    setCurrentAnswer(option);
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{questions[currentStep].title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {currentQuestion.type === 'text' ? (
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full"
            />
          ) : (
            <div className="grid gap-2">
              {currentQuestion.options.map((option) => (
                <Card 
                  key={option}
                  className={`cursor-pointer transition-colors hover:bg-muted ${
                    currentAnswer === option ? 'border-primary' : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <CardContent className="p-4">
                    {option}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(prev => prev - 1);
                  setCurrentAnswer('');
                }}
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!currentAnswer}
              className={currentStep === 0 ? 'w-full' : ''}
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
