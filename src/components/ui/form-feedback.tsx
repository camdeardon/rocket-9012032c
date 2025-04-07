
import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormFeedbackProps = {
  type: 'success' | 'error' | 'neutral';
  message?: string;
  className?: string;
};

export const FormFeedback = ({ type, message, className }: FormFeedbackProps) => {
  if (!message) return null;
  
  return (
    <div 
      className={cn(
        'flex items-center gap-1.5 text-sm mt-1',
        type === 'success' && 'text-green-600',
        type === 'error' && 'text-red-600',
        type === 'neutral' && 'text-muted-foreground',
        className
      )}
    >
      {type === 'success' && <CheckCircle className="h-4 w-4" />}
      {type === 'error' && <AlertCircle className="h-4 w-4" />}
      {type === 'neutral' && <Info className="h-4 w-4" />}
      <span>{message}</span>
    </div>
  );
};

export const getInputStateProps = (
  touched?: boolean, 
  error?: string, 
  success?: boolean
) => {
  if (!touched) return {};
  
  if (error) {
    return {
      className: "form-error",
      "aria-invalid": true,
    };
  }
  
  if (success) {
    return {
      className: "form-success",
    };
  }
  
  return {};
};
