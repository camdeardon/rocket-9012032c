
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

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
  return (
    <div className="space-y-4">
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
        />
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={onChange}
        />
        <Input
          name="state"
          placeholder="State/Province"
          value={formData.state}
          onChange={onChange}
        />
        <Input
          name="zipCode"
          placeholder="ZIP/Postal Code"
          value={formData.zipCode}
          onChange={onChange}
        />
        <Input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={onChange}
          className="col-span-2"
        />
      </div>
    </div>
  );
};

export default LocationSection;
