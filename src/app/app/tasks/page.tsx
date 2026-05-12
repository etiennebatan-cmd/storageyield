'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/use-organization';
import { supabaseClient } from '@/lib/supabase/client';
import type { Task } from '@/lib/types';

export default function TasksPage() {
  const org = useOrganization();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizationId = org?.id;
    if (!organizationId) return;

    async function load() {
      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (!error) setTasks(data || []);
      setLoading(false);
    }

    load();
  }, [org?.id]);

  if (loading) return <div className="p-4">Loading tasks...</div>;

  const priorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100';
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Priority</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-semibold">{task.title}</td>
                <td className="p-2 text-gray-600">{task.task_type}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-2 text-gray-600">{task.due_date || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="text-gray-500 text-center py-8">No tasks found.</div>
      )}
    </div>
  );
}
