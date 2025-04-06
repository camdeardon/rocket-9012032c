
-- Fix the calculate_match_scores function to resolve the ambiguous column references
CREATE OR REPLACE FUNCTION public.calculate_match_scores(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Clear existing match scores for the user
  DELETE FROM match_scores WHERE user_id = user_id_param;
  
  -- Insert calculated scores directly into match_scores table
  INSERT INTO match_scores (
    user_id,
    matched_user_id,
    skills_similarity,
    interests_similarity,
    similarity_score,
    created_at
  )
  WITH user_profile AS (
    SELECT 
      p.id,
      p.skills,
      p.interests,
      p.work_style,
      p.business_focus,
      p.core_values
    FROM profiles p
    WHERE p.id = user_id_param
  ),
  other_profiles AS (
    SELECT 
      p.id AS other_user_id,
      p.skills,
      p.interests,
      p.work_style,
      p.business_focus,
      p.core_values
    FROM profiles p
    WHERE p.id != user_id_param
  ),
  match_calculations AS (
    SELECT 
      op.other_user_id,
      -- Calculate skills match (array intersection / union)
      CASE 
        WHEN array_length(up.skills, 1) > 0 AND array_length(op.skills, 1) > 0
        THEN (
          CAST(array_length(ARRAY(SELECT UNNEST(up.skills) INTERSECT SELECT UNNEST(op.skills)), 1) AS NUMERIC) /
          CAST(GREATEST(array_length(ARRAY(SELECT UNNEST(up.skills) UNION SELECT UNNEST(op.skills)), 1), 1) AS NUMERIC) * 100
        )
        ELSE 0
      END as skills_match_score,
      -- Calculate interests match
      CASE 
        WHEN array_length(up.interests, 1) > 0 AND array_length(op.interests, 1) > 0
        THEN (
          CAST(array_length(ARRAY(SELECT UNNEST(up.interests) INTERSECT SELECT UNNEST(op.interests)), 1) AS NUMERIC) /
          CAST(GREATEST(array_length(ARRAY(SELECT UNNEST(up.interests) UNION SELECT UNNEST(op.interests)), 1), 1) AS NUMERIC) * 100
        )
        ELSE 0
      END as interests_match_score
    FROM user_profile up
    CROSS JOIN other_profiles op
  )
  SELECT 
    user_id_param,
    mc.other_user_id AS matched_user_id,
    ROUND(mc.skills_match_score, 2) as skills_similarity,
    ROUND(mc.interests_match_score, 2) as interests_similarity,
    ROUND((mc.skills_match_score + mc.interests_match_score) / 2, 2) as similarity_score,
    NOW()
  FROM match_calculations mc;
  
  -- If no matches were found, create placeholder matches with random users
  IF (SELECT COUNT(*) FROM match_scores WHERE user_id = user_id_param) = 0 THEN
    INSERT INTO match_scores (
      user_id,
      matched_user_id,
      skills_similarity,
      interests_similarity,
      similarity_score,
      created_at
    )
    SELECT 
      user_id_param,
      p.id AS matched_user_id,
      50.0 as skills_similarity,  -- Default match score
      50.0 as interests_similarity,  -- Default match score
      50.0 as similarity_score,  -- Default overall score
      NOW()
    FROM 
      profiles p
    WHERE 
      p.id != user_id_param
    LIMIT 5;  -- Get up to 5 random profiles
  END IF;
END;
$function$;

-- Make sure this function is called when a user completes their profile
CREATE OR REPLACE FUNCTION public.handle_profile_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if essential fields are filled
  IF NEW.first_name IS NOT NULL 
     AND NEW.last_name IS NOT NULL 
     AND NEW.email IS NOT NULL 
     AND NEW.bio IS NOT NULL 
     AND NEW.skills IS NOT NULL 
     AND NEW.interests IS NOT NULL THEN
    NEW.onboarding_completed := true;
    
    -- Recalculate match scores when profile is updated with essential fields
    PERFORM calculate_match_scores(NEW.id);
  END IF;
  RETURN NEW;
END;
$function$;
