import { useApi } from '@/hooks/useApi';
import { MOCK_ONBOARDING_DATA } from '@/lib/mock-data/onboarding';
import { useFlow } from '../../flow/hooks/useFlow';

export function useOnboarding() {
  const { saveFlowData } = useFlow();

  const {
    data: preferences,
    error,
    isLoading,
    execute: savePreferences
  } = useApi('/api/onboarding/generate-roadmap', {
    method: 'POST',
    fallbackData: MOCK_ONBOARDING_DATA.defaultAnswers
  });

  const submitOnboarding = async (answers) => {
    try {
      const response = await savePreferences(answers);
      localStorage.setItem('userPreferences', JSON.stringify(answers));

      if (response.content) {
        console.log('Saving flow data:', response.content);
        await saveFlowData(response.content);
      }

      return response;
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
      const fallbackResponse = {
        ...MOCK_ONBOARDING_DATA.defaultAnswers,
        ...answers
      };
      localStorage.setItem('userPreferences', JSON.stringify(fallbackResponse));
      return fallbackResponse;
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem('userPreferences');
    return true;
  };

  return {
    preferences,
    error,
    isLoading,
    submitOnboarding,
    resetOnboarding,
    questions: MOCK_ONBOARDING_DATA.questions
  };
}
