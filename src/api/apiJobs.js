import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved:saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }
  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error deleting Saved Job:", deleteError);
      return null;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error fetching Jobs:", insertError);
      return null;
    }

    return data;
  }
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*,company: companies(name,logo_url),applications: applications(*)")
    .eq("id", job_id)
    .single();
  let { data, error } = await query;
  if (error) {
    console.error("Error Fetching Job : ", error);
    return null;
  }

  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();
  let { data, error } = await query;
  if (error) {
    console.error("Error Updating Job : ", error);
    return null;
  }

  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("jobs").insert([jobData]).select();
  let { data, error } = await query;
  if (error) {
    console.error("Error Creating Job : ", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("saved_jobs")
    .select("*,job:jobs(*,company: companies(name, logo_url))");
  let { data, error } = await query;
  if (error) {
    console.error("Error Fetching Saved Jobs : ", error);
    return null;
  }

  return data;
}

// to show the jobs(created by that recruiter) of the recruiter
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);
  let { data, error } = await query;
  if (error) {F
    console.error("Error Fetching Jobs : ", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .delete()
    .eq('id',job_id)
    .select();
  let { data, error } = await query;
  if (error) {F
    console.error("Error Deleting Job : ", error);
    return null;
  }

  return data;
}
