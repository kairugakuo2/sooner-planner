import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Clock, Users, Info } from 'lucide-react';
import { usePlannerStore } from '@/store/plannerStore';
import { Style } from '@/store/plannerStore';

const styleOptions = [
  {
    id: 'compact' as Style,
    title: 'Compact Days',
    description: 'Stack classes into fewer days for longer weekends',
    icon: <Calendar className="h-5 w-5" />,
    details: 'Fewer class days, longer breaks between'
  },
  {
    id: 'balanced' as Style,
    title: 'Balanced Mix',
    description: 'A smart blend of class distribution throughout the week',
    icon: <Users className="h-5 w-5" />,
    details: 'Evenly spread classes with manageable daily loads',
    recommended: true
  },
  {
    id: 'spread' as Style,
    title: 'Spread Out',
    description: 'Lighter daily load with more consistent scheduling',
    icon: <Clock className="h-5 w-5" />,
    details: 'More class days, shorter daily sessions'
  }
];

export const StyleStep: React.FC = () => {
  const { style, setStyle } = usePlannerStore();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-gray-600">
          Select how you'd like to distribute your classes. This affects the spacing and timing of your schedule throughout the week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {styleOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => setStyle(option.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              style === option.id
                ? 'border-crimson-500 bg-crimson-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-center space-y-4">
              {/* Icon */}
              <div className={`mx-auto p-3 rounded-lg ${
                style === option.id ? 'bg-crimson-100' : 'bg-gray-100'
              }`}>
                <div className={style === option.id ? 'text-crimson-600' : 'text-gray-600'}>
                  {option.icon}
                </div>
              </div>

              {/* Title and Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{option.title}</h4>
                  {option.recommended && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600">{option.description}</p>
                
                {/* Details */}
                <p className="text-xs text-gray-500 italic">{option.details}</p>
              </div>

              {/* Selection Indicator */}
              {style === option.id && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-crimson-600 border-4 border-crimson-100"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Schedule Style Impact</p>
            <p className="mt-1">
              Your choice affects how we optimize your schedule. <strong>Balanced Mix</strong> is recommended for most students 
              as it provides a good balance between class density and free time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
