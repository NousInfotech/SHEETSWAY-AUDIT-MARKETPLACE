export type MilestoneStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'on_hold';

export interface Milestone {
  id: string;
  engagementId: string;
  label: string;
  status: MilestoneStatus;
  dueDate: string | null;
  completedAt: string | null;
  auditorId: string;
  createdAt: string;
}
