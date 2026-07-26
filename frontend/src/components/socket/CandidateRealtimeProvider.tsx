"use client";

import { useState } from "react";
import CandidateSocketListener from "./CandidateSocketListener";

function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("User");
    if (!storedUser) return null;

    const user: unknown = JSON.parse(storedUser);
    if (
      user &&
      typeof user === "object" &&
      "id" in user &&
      typeof user.id === "string"
    ) {
      return user.id;
    }
  } catch {
    localStorage.removeItem("User");
  }

  return null;
}

export default function CandidateRealtimeProvider() {
  const [userId] = useState(getStoredUserId);

  if (!userId) return null;

  return <CandidateSocketListener userId={userId} />;
}
