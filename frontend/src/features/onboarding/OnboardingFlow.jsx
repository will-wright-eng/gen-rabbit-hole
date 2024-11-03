import React, { useState } from 'react';
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
import { useOnboarding } from '../../hooks/useOnboarding';
import { Progress } from "@/components/ui/progress";

const OnboardingFlow = ({ isOpen, onComplete }) => {
  const { submitOnboarding, questions } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (!currentAnswer) return;

    const updatedAnswers = {
      ...answers,
      [questions[currentStep].id]: currentAnswer
    };

    if (currentStep === questions.length - 1) {
      try {
        const result = await submitOnboarding(updatedAnswers);
        onComplete(result);
      } catch (error) {
        console.error('Onboarding failed:', error);
      }
    } else {
      setAnswers(updatedAnswers);
      setCurrentStep(prev => prev + 1);
      setCurrentAnswer('');
    }
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentQuestion.title}</DialogTitle>
        </DialogHeader>

        <Progress value={progress} className="mb-4" />

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
                  onClick={() => setCurrentAnswer(option)}
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
                  setCurrentAnswer(answers[questions[currentStep - 1].id] || '');
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
