
import { useProfileFetch } from "./useProfileFetch";
import { useProfileEdit } from "./useProfileEdit";
import { useFileManagement } from "./useFileManagement";

export const useProfileData = () => {
  const { 
    profileData, 
    setProfileData, 
    userSkills, 
    userInterests, 
    isLoading 
  } = useProfileFetch();

  const { 
    editMode, 
    editedValues, 
    setEditMode, 
    setEditedValues, 
    handleSave 
  } = useProfileEdit(profileData, setProfileData);

  const { handleFileChange } = useFileManagement(profileData, setProfileData);

  return {
    profileData,
    userSkills,
    userInterests,
    isLoading,
    editMode,
    editedValues,
    setEditMode,
    setEditedValues,
    handleSave,
    handleFileChange,
    setProfileData,
  };
};
