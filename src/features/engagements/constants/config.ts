import { Calendar, Clock, CheckCircle } from 'lucide-react';

export const statusConfig = {
  'Planning': { color: 'bg-blue-500', icon: Calendar, textColor: 'text-blue-600' },
  'In Progress': { color: 'bg-yellow-500', icon: Clock, textColor: 'text-yellow-600' },
  'Under Review': { color: 'bg-purple-500', icon: CheckCircle, textColor: 'text-purple-600' }
};

export const priorityConfig = {
  'High': { color: 'bg-red-500', textColor: 'text-red-600' },
  'Medium': { color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  'Low': { color: 'bg-green-500', textColor: 'text-green-600' }
};

export const paymentStatusConfig = {
  'Pending': { color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  'In Escrow': { color: 'bg-blue-500', textColor: 'text-blue-600' },
  'Released': { color: 'bg-green-500', textColor: 'text-green-600' },
  'Completed': { color: 'bg-green-600', textColor: 'text-green-700' }
};

export const contractStatusConfig = {
  'Draft': { color: 'bg-gray-500', textColor: 'text-gray-600' },
  'Sent': { color: 'bg-blue-500', textColor: 'text-blue-600' },
  'Signed': { color: 'bg-green-500', textColor: 'text-green-600' },
  'Expired': { color: 'bg-red-500', textColor: 'text-red-600' }
}; 