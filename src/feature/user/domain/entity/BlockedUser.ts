interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason?: string;
  created_at: Date;
}