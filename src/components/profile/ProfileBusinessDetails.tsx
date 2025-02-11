
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, LineChart, Edit2, Save, Target } from "lucide-react";

interface ProfileBusinessDetailsProps {
  formData: {
    business_focus?: string[];
    investment_preferences?: string[];
    entrepreneurial_experience?: string;
    core_values?: string[];
  };
  editMode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileBusinessDetails = ({
  formData,
  editMode,
  onChange,
}: ProfileBusinessDetailsProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Business Details</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Business Focus Areas</label>
          <Textarea
            value={formData.business_focus?.join(', ') || ''}
            onChange={(e) => onChange(e)}
            name="business_focus"
            placeholder="Enter business focus areas (comma-separated)"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Investment Preferences</label>
          <Textarea
            value={formData.investment_preferences?.join(', ') || ''}
            onChange={(e) => onChange(e)}
            name="investment_preferences"
            placeholder="Enter investment preferences (comma-separated)"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Entrepreneurial Experience</label>
          <Textarea
            value={formData.entrepreneurial_experience || ''}
            onChange={(e) => onChange(e)}
            name="entrepreneurial_experience"
            placeholder="Describe your entrepreneurial experience"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Core Values</label>
          <Textarea
            value={formData.core_values?.join(', ') || ''}
            onChange={(e) => onChange(e)}
            name="core_values"
            placeholder="Enter core values (comma-separated)"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileBusinessDetails;
