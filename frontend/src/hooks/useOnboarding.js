import { useApi } from './useApi';
import { MOCK_ONBOARDING_DATA } from '../lib/mock-data/onboarding';

export function useOnboarding() {
  const {
    data: preferences,
    error,
    isLoading,
    execute: savePreferences
  } = useApi('/api/onboarding', {
    method: 'POST',
    fallbackData: MOCK_ONBOARDING_DATA.defaultAnswers
  });

  const submitOnboarding = async (answers) => {
    try {
      const response = await savePreferences(answers);
      localStorage.setItem('userPreferences', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
      // Use fallback data
      const fallbackResponse = {
        ...MOCK_ONBOARDING_DATA.defaultAnswers,
        ...answers
      };
      localStorage.setItem('userPreferences', JSON.stringify(fallbackResponse));
      return fallbackResponse;
    }
  };

  return {
    preferences,
    error,
    isLoading,
    submitOnboarding,
    questions: MOCK_ONBOARDING_DATA.questions
  };
}
