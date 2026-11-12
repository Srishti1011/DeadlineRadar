import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { addDays, getTodayISO } from './utils/dateUtils';

const saveTasks = (tasks) => {
  window.localStorage.setItem('deadline_radar_tasks', JSON.stringify(tasks));
  window.localStorage.setItem('deadline_radar_subjects', JSON.stringify([]));
};

const task = (overrides = {}) => ({
  id: 'task-seed',
  title: 'Seed task',
  description: 'Seed description',
  subjectId: null,
  subjectName: 'General / Unassigned',
  category: 'Assignment',
  dueDate: addDays(getTodayISO(), 2),
  dueTime: '23:59',
  priority: 'medium',
  estimatedHours: 2,
  notes: '',
  completed: false,
  completedAt: null,
  createdAt: getTodayISO(),
  ...overrides
});

const openTasksPage = async (user) => {
  await user.click(screen.getByRole('button', { name: /^My Tasks/ }));
};

const addTaskThroughForm = async (user, title, dueDate = addDays(getTodayISO(), 2)) => {
  await user.click(screen.getByRole('button', { name: 'New Task' }));
  await user.type(screen.getByPlaceholderText('e.g., Red-Black Tree Insertion & Invariant Verification'), title);
  const dateInput = document.querySelector('input[type="date"]');
  await user.clear(dateInput);
  await user.type(dateInput, dueDate);
  await user.click(screen.getByRole('button', { name: 'Schedule Task' }));
};

describe('Deadline Radar task workflows', () => {
  beforeEach(() => {
    saveTasks([]);
  });

  it('adds a deadline and restores it after remounting the application', async () => {
    const user = userEvent.setup();
    const firstRender = render(<App />);
    await openTasksPage(user);
    await addTaskThroughForm(user, 'Research paper');

    expect(await screen.findByRole('heading', { name: 'Research paper' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('deadline_radar_tasks'))[0].title)
      .toBe('Research paper');

    firstRender.unmount();
    render(<App />);
    await openTasksPage(user);
    expect(await screen.findByRole('heading', { name: 'Research paper' })).toBeInTheDocument();
  });

  it('edits a deadline and deletes it only after confirmation', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksPage(user);
    await addTaskThroughForm(user, 'Draft report');

    await user.click(screen.getByRole('button', { name: 'Task options' }));
    await user.click(screen.getByRole('button', { name: 'Edit Task' }));
    const titleInput = screen.getByPlaceholderText('e.g., Red-Black Tree Insertion & Invariant Verification');
    await user.clear(titleInput);
    await user.type(titleInput, 'Final report');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByRole('heading', { name: 'Final report' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Draft report' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Task options' }));
    await user.click(screen.getByRole('button', { name: 'Delete Task' }));
    expect(screen.getByRole('heading', { name: 'Delete Task' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Final report' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete', exact: true }));
    expect(screen.queryByRole('heading', { name: 'Final report' })).not.toBeInTheDocument();
    expect(screen.getByText('No matching academic tasks found')).toBeInTheDocument();
  });

  it('marks a task complete and updates dashboard task statistics', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksPage(user);
    await addTaskThroughForm(user, 'Prepare presentation');

    await user.click(screen.getByRole('button', { name: 'Mark task as completed' }));
    await user.click(screen.getByRole('button', { name: /^Completed/ }));
    expect(await screen.findByRole('heading', { name: 'Prepare presentation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark task as pending' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Overview' }));
    expect(screen.getByText('All academic tasks are clear! Take a well-deserved break.'))
      .toBeInTheDocument();
    const completedStat = screen.getByText('Completed Tasks').parentElement.parentElement;
    expect(within(completedStat).getByText('1')).toBeInTheDocument();
  });

  it('searches task details, filters status, and sorts titles', async () => {
    saveTasks([
      task({ id: 'alpha', title: 'Alpha research', dueDate: addDays(getTodayISO(), 4) }),
      task({
        id: 'beta',
        title: 'Beta assignment',
        description: 'Searchable unique wording',
        dueDate: addDays(getTodayISO(), 1),
        priority: 'high'
      }),
      task({
        id: 'gamma',
        title: 'Gamma completed',
        completed: true,
        completedAt: getTodayISO(),
        dueDate: addDays(getTodayISO(), -1)
      })
    ]);
    const user = userEvent.setup();
    render(<App />);
    await openTasksPage(user);

    await user.type(screen.getByPlaceholderText('Filter by keyword...'), 'unique wording');
    expect(screen.getByRole('heading', { name: 'Beta assignment' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Alpha research' })).not.toBeInTheDocument();

    const search = screen.getByPlaceholderText('Filter by keyword...');
    await user.clear(search);
    await user.click(screen.getByRole('button', { name: /^Pending/ }));
    expect(screen.getByRole('heading', { name: 'Beta assignment' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Gamma completed' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /All Tasks/ }));
    await user.selectOptions(screen.getByDisplayValue('Deadline: Soonest first'), 'deadline-desc');
    let titles = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent);
    expect(titles).toEqual(['Alpha research', 'Beta assignment', 'Gamma completed']);

    await user.selectOptions(screen.getByDisplayValue('Deadline: Furthest first'), 'title-asc');
    titles = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent);
    expect(titles).toEqual(['Alpha research', 'Beta assignment', 'Gamma completed']);
  });

  it('shows overdue tasks in the overdue filter and excludes future deadlines', async () => {
    saveTasks([
      task({ id: 'late', title: 'Late submission', dueDate: addDays(getTodayISO(), -1) }),
      task({ id: 'soon', title: 'Upcoming submission', dueDate: addDays(getTodayISO(), 1) })
    ]);
    const user = userEvent.setup();
    render(<App />);
    await openTasksPage(user);
    await user.click(screen.getByRole('button', { name: /Overdue/ }));

    expect(screen.getByRole('heading', { name: 'Late submission' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Upcoming submission' })).not.toBeInTheDocument();
  });

  it('validates a required title without creating a deadline', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksPage(user);
    await user.click(screen.getByRole('button', { name: 'New Task' }));
    await user.click(screen.getByRole('button', { name: 'Schedule Task' }));

    expect(screen.getByText('Task title is required')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Add New Academic Task' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('deadline_radar_tasks'))).toEqual([]);
  });

  it('shows the empty state when no tasks match the selected filters', async () => {
    saveTasks([task({ title: 'A task without this keyword' })]);
    const user = userEvent.setup();
    render(<App />);
    await openTasksPage(user);
    await user.type(screen.getByPlaceholderText('Filter by keyword...'), 'missing result');

    expect(screen.getByText('No matching academic tasks found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Filters' })).toBeInTheDocument();
  });
});
