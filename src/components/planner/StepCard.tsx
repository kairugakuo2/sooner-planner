import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  required: boolean;
  isValid: boolean;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  required,
  isValid,
  children,
  isOpen,
  onToggle
}) => {
  const getStatusIcon = () => {
    if (required && !isValid) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Info className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (required && !isValid) {
      return 'Needs input';
    }
    if (isValid) {
      return 'Saved';
    }
    return required ? 'Required' : 'Optional';
  };

  const getStatusColor = () => {
    if (required && !isValid) {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (isValid) {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-crimson-100 text-crimson-700 font-semibold text-sm">
              {stepNumber}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <Badge 
              variant={required ? "default" : "secondary"}
              className={required ? "bg-crimson-100 text-crimson-800 border-crimson-200" : ""}
            >
              {required ? 'Required' : 'Optional'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor()}>
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className="text-xs">{getStatusText()}</span>
              </div>
            </Badge>
            <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};
