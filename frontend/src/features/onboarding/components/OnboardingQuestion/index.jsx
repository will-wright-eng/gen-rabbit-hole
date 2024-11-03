import React from 'react';
import { TextInput } from './TextInput';
import { OptionCards } from './OptionCards';

const OnboardingQuestion = ({ question, value, onChange }) => {
  if (question.type === 'text') {
    return (
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={question.placeholder}
      />
    );
  }
  
  return (
    <OptionCards
      options={question.options}
      value={value}
      onChange={onChange}
    />
  );
};

export default OnboardingQuestion;
