import { getSupabase } from "../../config/supabase.js"

export const getNotificationsService = async (
  userId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      user_id,
      application_id,
      type,
      title,
      message,
      data,
      is_read,
      read_at,
      created_at,
      updated_at
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const markNotificationAsReadService = async (
  notificationId: string,
  userId: string,
  token: string,
) => {
  const supabase = getSupabase(token);

  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select(`
      id,
      user_id,
      application_id,
      type,
      title,
      message,
      data,
      is_read,
      read_at,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Notification not found");
    }

    throw new Error(error.message);
  }

  return data;
};


