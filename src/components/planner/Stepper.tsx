import React from 'react';
import { StepCard } from './StepCard';
import { CourseStep } from './steps/CourseStep';
import { TimePrefsStep } from './steps/TimePrefsStep';
import { StyleStep } from './steps/StyleStep';
import { ReviewStep } from './steps/ReviewStep';
import { usePlannerStore } from '@/store/plannerStore';

const stepsConfig = [
  { id: 'courses', title: 'Select Courses', required: true },
  { id: 'prefs', title: 'Time Preferences', required: false },
  { id: 'style', title: 'Schedule Style', required: true },
  { id: 'review', title: 'Review & Generate', required: true },
] as const;

export const Stepper: React.FC = () => {
  const { openStep, setOpenStep, getRequiredValid, getAllRequiredValid } = usePlannerStore();
  
  const requiredValid = getRequiredValid();
  const allRequiredValid = getAllRequiredValid();
  const completedRequired = Object.values(requiredValid).filter(Boolean).length;
  const totalRequired = Object.keys(requiredValid).length;

  const handleStepToggle = (stepId: string) => {
    setOpenStep(openStep === stepId ? null : stepId);
  };

  const getStepContent = (stepId: string) => {
    switch (stepId) {
      case 'courses':
        return <CourseStep />;
      case 'prefs':
        return <TimePrefsStep />;
      case 'style':
        return <StyleStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return null;
    }
  };

  const getStepValidation = (stepId: string) => {
    switch (stepId) {
      case 'courses':
        return requiredValid.courses;
      case 'prefs':
        return true; // Always valid (optional)
      case 'style':
        return requiredValid.style;
      case 'review':
        return allRequiredValid;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 -mx-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Progress:</span>
              <span className="text-sm font-semibold text-crimson-600">
                {completedRequired}/{totalRequired} required steps complete
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((completedRequired / totalRequired) * 100)}% Complete
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-crimson-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedRequired / totalRequired) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {stepsConfig.map((step, index) => (
          <div key={step.id} id={`step-${step.id}`}>
            <StepCard
              stepNumber={index + 1}
              title={step.title}
              required={step.required}
              isValid={getStepValidation(step.id)}
              isOpen={openStep === step.id}
              onToggle={() => handleStepToggle(step.id)}
            >
              {getStepContent(step.id)}
            </StepCard>
          </div>
        ))}
      </div>
    </div>
  );
};
