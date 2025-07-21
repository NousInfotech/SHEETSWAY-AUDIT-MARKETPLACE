import React, { useState } from 'react';
import { Engagement } from '../types/engagement-types';
import { Save, Trash2, UserPlus, UserMinus, Archive, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

interface EngagementSettingsTabProps {
  engagement: Engagement;
  onUpdate: (engagement: Engagement) => void;
}

const EngagementSettingsTab: React.FC<EngagementSettingsTabProps> = ({ engagement, onUpdate }) => {
  const [form, setForm] = useState({
    name: engagement.clientName,
    description: engagement.description,
    status: engagement.status,
    visibility: engagement.visibility || 'Private',
    emailAlerts: engagement.notificationSettings?.emailAlerts ?? false,
    milestoneReminders: engagement.notificationSettings?.milestoneReminders ?? false,
    deadlineWarnings: engagement.notificationSettings?.deadlineWarnings ?? false,
    archived: false, // Mocked for now
    teamMembers: engagement.teamMembers || [],
    newMember: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox') {
      checked = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    onUpdate({
      ...engagement,
      clientName: form.name,
      description: form.description,
      status: form.status as Engagement['status'],
      visibility: form.visibility as Engagement['visibility'],
      notificationSettings: {
        emailAlerts: form.emailAlerts,
        milestoneReminders: form.milestoneReminders,
        deadlineWarnings: form.deadlineWarnings
      },
      teamMembers: form.teamMembers
    });
    toast.success('Settings saved!');
  };

  const handleAddMember = () => {
    if (form.newMember.trim() && !form.teamMembers.includes(form.newMember.trim())) {
      setForm(prev => ({ ...prev, teamMembers: [...prev.teamMembers, prev.newMember.trim()], newMember: '' }));
    }
  };
  const handleRemoveMember = (member: string) => {
    setForm(prev => ({ ...prev, teamMembers: prev.teamMembers.filter(m => m !== member) }));
  };
  const handleArchive = () => {
    setForm(prev => ({ ...prev, archived: !prev.archived }));
    toast(form.archived ? 'Engagement unarchived.' : 'Engagement archived.');
  };
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    toast('Engagement permanently deleted. (Mocked)');
    // TODO: Call backend to delete
  };

  return (
    <div className="max-w-xl mx-auto bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors space-y-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Engagement Settings</h2>
      <div className="space-y-4">
        {/* Editable Name/Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Engagement Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Scope</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            rows={3}
          />
        </div>
        {/* Team Members Management */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Members</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.teamMembers.map(member => (
              <span key={member} className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                {member}
                <button type="button" onClick={() => handleRemoveMember(member)} className="ml-1 text-red-500 hover:text-red-700">
                  <UserMinus className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              name="newMember"
              value={form.newMember}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              placeholder="Add team member"
            />
            <button type="button" onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 flex items-center gap-1">
              <UserPlus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
        {/* Existing settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="Private">Private</option>
            <option value="Team">Team</option>
            <option value="Public">Public</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Preferences</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="emailAlerts"
                checked={form.emailAlerts}
                onChange={handleChange}
                className="form-checkbox"
              />
              Email Alerts
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="milestoneReminders"
                checked={form.milestoneReminders}
                onChange={handleChange}
                className="form-checkbox"
              />
              Milestone Reminders
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="deadlineWarnings"
                checked={form.deadlineWarnings}
                onChange={handleChange}
                className="form-checkbox"
              />
              Deadline Warnings
            </label>
          </div>
        </div>
        {/* Archive/Unarchive */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleArchive} className={`rounded-lg px-3 py-2 flex items-center gap-1 ${form.archived ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}> 
            {form.archived ? <Undo2 className="h-4 w-4" /> : <Archive className="h-4 w-4" />} 
            {form.archived ? 'Unarchive' : 'Archive'}
          </button>
          {form.archived && <span className="text-yellow-700 dark:text-yellow-400 text-sm">This engagement is archived.</span>}
        </div>
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
        {/* Danger Zone */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete this engagement. This action cannot be undone.</p>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" /> Delete Engagement
          </button>
          {showDeleteConfirm && (
            <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg">
              <p className="mb-2 text-red-700">Are you sure you want to permanently delete this engagement?</p>
              <div className="flex gap-2">
                <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2">Yes, Delete</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngagementSettingsTab; 