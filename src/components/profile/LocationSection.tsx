
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { FormFeedback } from "@/components/ui/form-feedback";

interface LocationSectionProps {
  formData: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationSection = ({ formData, onChange }: LocationSectionProps) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field: string, value: string) => {
    if (!touched[field]) return null;
    
    if (!value) {
      return { error: "This field is required" };
    }
    
    if (field === 'zipCode' && !/^\d{5}(-\d{4})?$/.test(value) && value.length > 0) {
      return { error: "Please enter a valid ZIP code" };
    }
    
    return { success: true };
  };

  const fieldValidations = {
    city: validateField('city', formData.city),
    country: validateField('country', formData.country),
  };

  const inputClasses = (field: string) => {
    const validation = field === 'city' ? fieldValidations.city : 
                       field === 'country' ? fieldValidations.country : null;
    
    return `form-input-focus animate-soft ${
      validation?.error ? 'form-error' : 
      validation?.success ? 'form-success' : ''
    }`;
  };

  return (
    <div className="space-y-4 animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
      <Label className="text-lg font-semibold flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Location
      </Label>
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="street"
          placeholder="Street Address"
          value={formData.street}
          onChange={onChange}
          onBlur={() => handleBlur('street')}
          className={inputClasses('street')}
        />
        <div className="flex flex-col">
          <Input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={onChange}
            onBlur={() => handleBlur('city')}
            className={inputClasses('city')}
            aria-invalid={!!fieldValidations.city?.error}
          />
          {fieldValidations.city?.error && (
            <FormFeedback type="error" message={fieldValidations.city.error} />
          )}
        </div>
        <Input
          name="state"
          placeholder="State/Province"
          value={formData.state}
          onChange={onChange}
          onBlur={() => handleBlur('state')}
          className={inputClasses('state')}
        />
        <Input
          name="zipCode"
          placeholder="ZIP/Postal Code"
          value={formData.zipCode}
          onChange={onChange}
          onBlur={() => handleBlur('zipCode')}
          className={inputClasses('zipCode')}
        />
        <div className="flex flex-col col-span-2">
          <Input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={onChange}
            onBlur={() => handleBlur('country')}
            className={inputClasses('country')}
            aria-invalid={!!fieldValidations.country?.error}
          />
          {fieldValidations.country?.error && (
            <FormFeedback type="error" message={fieldValidations.country.error} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
