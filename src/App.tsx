import { type FormEvent, type KeyboardEvent, type SVGProps, useEffect, useRef, useState } from 'react'
import './App.css'

type Activity = {
  id: string
  text: string
  date: string
  createdAt: string
}

const STORAGE_KEY = import.meta.env.DEV ? 'daybook.activities.dev.v1' : 'daybook.activities.v1'
const HISTORY_LENGTH = 7
const VISIBLE_ENTRY_LIMIT = 5

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftDate(date: Date, days: number) {
  const shifted = new Date(date)
  shifted.setDate(shifted.getDate() + days)
  return shifted
}

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

function getPreviousWeekday(date: Date) {
  let previous = shiftDate(date, -1)

  while (isWeekend(previous)) {
    previous = shiftDate(previous, -1)
  }

  return previous
}

function getRecentWeekdays(date: Date, count: number) {
  const weekdays: Date[] = []
  let current = new Date(date)

  while (weekdays.length < count) {
    if (!isWeekend(current)) weekdays.push(current)
    current = shiftDate(current, -1)
  }

  return weekdays
}

function createMockActivities(): Activity[] {
  const today = new Date()
  const days = [today, ...getRecentWeekdays(getPreviousWeekday(today), HISTORY_LENGTH - 1)]
  const entries = [
    [
      'Reviewed pull requests for the onboarding flow',
      'Fixed validation on the account settings form',
      'Paired with Alex on the API migration',
      'Updated the release checklist',
      'Investigated a slow dashboard query',
      'Prepared notes for the product sync',
      'Shared the staging build with QA',
    ],
    [
      'Shipped the new onboarding welcome screen',
      'Resolved two accessibility issues',
      'Reviewed analytics for the latest release',
      'Documented the deployment process',
      'Met with design to refine empty states',
      'Planned the next iteration with the team',
    ],
    [
      'Added loading states to the activity feed',
      'Refactored the date formatting helpers',
      'Reviewed the mobile layout',
      'Triaged incoming bug reports',
    ],
    [
      'Improved keyboard navigation',
      'Updated dependencies and verified the build',
      'Wrote release notes for the weekly update',
    ],
    [
      'Tested the history recap modal',
      'Simplified the local storage integration',
      'Reviewed copy changes with the team',
      'Fixed spacing on smaller screens',
      'Prepared the sprint demo',
    ],
    [
      'Mapped the next set of product improvements',
      'Cleaned up old implementation notes',
    ],
  ]

  return days.flatMap((day, dayIndex) =>
    (entries[dayIndex] ?? []).map((text, entryIndex) => {
      const createdAt = new Date(day)
      createdAt.setHours(9 + Math.floor(entryIndex / 2), entryIndex % 2 === 0 ? 0 : 30, 0, 0)

      return {
        id: `mock-${toDateKey(day)}-${entryIndex}`,
        text,
        date: toDateKey(day),
        createdAt: createdAt.toISOString(),
      }
    }),
  )
}

function formatDate(date: Date, includeWeekday = false) {
  return new Intl.DateTimeFormat('en-GB', {
    ...(includeWeekday && { weekday: 'long' }),
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date)
}

function formatTime(isoDate: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

function loadActivities(): Activity[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return import.meta.env.DEV ? createMockActivities() : []

    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return import.meta.env.DEV ? createMockActivities() : []

    const storedActivities = parsed.filter(
      (activity): activity is Activity =>
        typeof activity === 'object' &&
        activity !== null &&
        typeof activity.id === 'string' &&
        typeof activity.text === 'string' &&
        typeof activity.date === 'string' &&
        typeof activity.createdAt === 'string',
    )

    return storedActivities.length > 0 || !import.meta.env.DEV
      ? storedActivities
      : createMockActivities()
  } catch {
    return import.meta.env.DEV ? createMockActivities() : []
  }
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m5 10.4 3.1 3.1L15 6.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2.8c.4 4.8 2.8 7.2 7.6 7.6-4.8.4-7.2 2.8-7.6 7.6-.4-4.8-2.8-7.2-7.6-7.6C9.2 10 11.6 7.6 12 2.8Z" fill="currentColor" />
      <path d="M19.2 16.2c.1 2.2 1.2 3.3 3.3 3.4-2.1.2-3.2 1.3-3.3 3.4-.2-2.1-1.3-3.2-3.4-3.4 2.1-.1 3.2-1.2 3.4-3.4Z" fill="currentColor" />
    </svg>
  )
}

function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m12.9 4.3 2.8 2.8M5 15l1.1-3.4 7.5-7.5a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2l-7.5 7.5L5 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DeleteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M5.8 6.5v9.2h8.4V6.5M4.5 6.5h11M8 6.5V4.3h4v2.2M8.5 9v4.3M11.5 9v4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function App() {
  const [activities, setActivities] = useState<Activity[]>(loadActivities)
  const [now, setNow] = useState(() => new Date())
  const [newActivity, setNewActivity] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedHistoryDay, setSelectedHistoryDay] = useState<Date | null>(null)
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null)
  const historyDialogRef = useRef<HTMLDialogElement>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  const todayKey = toDateKey(now)
  const previousWeekday = getPreviousWeekday(now)
  const previousWeekdayKey = toDateKey(previousWeekday)
  const historyDays = getRecentWeekdays(now, HISTORY_LENGTH)
  const todayActivities = activities.filter((activity) => activity.date === todayKey)
  const previousWorkdayActivities = activities.filter((activity) => activity.date === previousWeekdayKey)
  const selectedHistoryActivities = selectedHistoryDay
    ? activities.filter((activity) => activity.date === toDateKey(selectedHistoryDay))
    : []

  useEffect(() => {
    let timeoutId: number

    function scheduleNextDay() {
      const current = new Date()
      const nextDay = new Date(current)
      nextDay.setHours(24, 0, 0, 0)
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(refreshDay, nextDay.getTime() - current.getTime())
    }

    function refreshDay() {
      const current = new Date()
      setNow(current)
      scheduleNextDay()
    }

    function handleVisibilityChange() {
      if (!document.hidden) refreshDay()
    }

    scheduleNextDay()
    window.addEventListener('focus', refreshDay)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('focus', refreshDay)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    const dialog = historyDialogRef.current
    if (selectedHistoryDay && dialog && !dialog.open) dialog.showModal()
  }, [selectedHistoryDay])

  useEffect(() => {
    const dialog = deleteDialogRef.current
    if (activityToDelete && dialog && !dialog.open) dialog.showModal()
  }, [activityToDelete])

  function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = newActivity.trim()
    if (!text) return

    const createdOn = new Date()
    setNow(createdOn)
    setActivities((current) => [
      {
        id: crypto.randomUUID(),
        text,
        date: toDateKey(createdOn),
        createdAt: createdOn.toISOString(),
      },
      ...current,
    ])
    setNewActivity('')
  }

  function startEditing(activity: Activity) {
    setEditingId(activity.id)
    setEditValue(activity.text)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditValue('')
  }

  function saveEdit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()
    const text = editValue.trim()
    if (!text) return

    setActivities((current) =>
      current.map((activity) => (activity.id === id ? { ...activity, text } : activity)),
    )
    cancelEditing()
  }

  function confirmDeleteActivity() {
    if (!activityToDelete) return

    setActivities((current) => current.filter((item) => item.id !== activityToDelete.id))
    if (editingId === activityToDelete.id) cancelEditing()
    deleteDialogRef.current?.close()
  }

  function openHistoryDay(day: Date) {
    setSelectedHistoryDay(new Date(day))
  }

  function handleHistoryDayKeyDown(event: KeyboardEvent<HTMLElement>, day: Date) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    openHistoryDay(day)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><SparkIcon /></span>
          <span>Daybook</span>
        </div>
        <div className="today-label">
          <span className="status-dot" />
          {formatDate(now, true)}
        </div>
      </header>

      <div className="content" id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="eyebrow">Your daily work log</div>
          <h1 id="hero-title">What did you get done?</h1>
          <p>Capture it while it’s fresh. Your standup will practically write itself.</p>

          <form className="capture-form" onSubmit={addActivity}>
            <label htmlFor="activity">Add an activity</label>
            <div className="capture-row">
              <input
                id="activity"
                value={newActivity}
                onChange={(event) => setNewActivity(event.target.value)}
                placeholder="e.g. Shipped the new onboarding flow"
                autoComplete="off"
              />
              <button className="primary-button" type="submit" disabled={!newActivity.trim()}>
                Log activity
                <ArrowIcon />
              </button>
            </div>
            <span className="form-hint">Press Enter to add</span>
          </form>
        </section>

        <div className="dashboard-grid">
          <section className="panel today-panel" aria-labelledby="today-heading">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">Today</span>
                <h2 id="today-heading">Your progress</h2>
              </div>
              <span className="count-badge">{todayActivities.length} {todayActivities.length === 1 ? 'entry' : 'entries'}</span>
            </div>

            {todayActivities.length > 0 ? (
              <ol className={`activity-list${todayActivities.length > VISIBLE_ENTRY_LIMIT ? ' scrollable-list' : ''}`}>
                {todayActivities.map((activity) => (
                  <li className="activity-item" key={activity.id}>
                    <span className="check-circle"><CheckIcon /></span>
                    {editingId === activity.id ? (
                      <form className="edit-form" onSubmit={(event) => saveEdit(event, activity.id)}>
                        <input
                          aria-label="Edit activity"
                          value={editValue}
                          onChange={(event) => setEditValue(event.target.value)}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button className="text-button muted" type="button" onClick={cancelEditing}>Cancel</button>
                          <button className="save-button" type="submit" disabled={!editValue.trim()}>Save</button>
                        </div>
                      </form>
                    ) : (
                      <div className="activity-content">
                        <div>
                          <p>{activity.text}</p>
                          <time dateTime={activity.createdAt}>{formatTime(activity.createdAt)}</time>
                        </div>
                        <div className="activity-actions">
                          <button className="icon-button" type="button" onClick={() => startEditing(activity)} aria-label={`Edit ${activity.text}`}>
                            <EditIcon />
                          </button>
                          <button className="icon-button delete-button" type="button" onClick={() => setActivityToDelete(activity)} aria-label={`Delete ${activity.text}`}>
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><SparkIcon /></span>
                <h3>Your day starts here</h3>
                <p>Add your first activity above and build a clear record of your progress.</p>
              </div>
            )}
          </section>

          <aside className="panel yesterday-panel" aria-labelledby="previous-workday-heading">
            <div className="panel-heading">
              <div>
                <span className="section-kicker coral">Previous workday</span>
                <h2 id="previous-workday-heading">At a glance</h2>
              </div>
              <span className="date-chip">{formatDate(previousWeekday, true)}</span>
            </div>

            {previousWorkdayActivities.length > 0 ? (
              <ul className={`yesterday-list${previousWorkdayActivities.length > VISIBLE_ENTRY_LIMIT ? ' scrollable-list' : ''}`}>
                {previousWorkdayActivities.map((activity) => (
                  <li key={activity.id}>
                    <span className="tiny-check"><CheckIcon /></span>
                    <p>{activity.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state compact">
                <span className="empty-line" />
                <h3>No activities recorded</h3>
                <p>The previous workday’s entries will appear here for a quick standup recap.</p>
              </div>
            )}
          </aside>
        </div>

        <section className="history-section" aria-labelledby="history-heading">
          <div className="history-heading-row">
            <div>
              <span className="section-kicker">History</span>
              <h2 id="history-heading">The last 7 workdays</h2>
            </div>
            <p>Stored privately in this browser</p>
          </div>

          <div className="history-grid">
            {historyDays.map((day) => {
              const key = toDateKey(day)
              const dayActivities = activities.filter((activity) => activity.date === key)
              return (
                <article
                  aria-haspopup="dialog"
                  aria-label={`View ${dayActivities.length} ${dayActivities.length === 1 ? 'activity' : 'activities'} for ${formatDate(day, true)}`}
                  className={`history-day${key === todayKey ? ' current' : ''}`}
                  key={key}
                  onClick={() => openHistoryDay(day)}
                  onKeyDown={(event) => handleHistoryDayKeyDown(event, day)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="history-day-heading">
                    <div className="history-date">
                      <span>{key === todayKey ? 'Today' : formatWeekday(day)}</span>
                      <span>{formatDate(day)}</span>
                    </div>
                    <strong>{dayActivities.length}</strong>
                  </div>
                  {dayActivities.length > 0 ? (
                    <ul>
                      {dayActivities.slice(0, 3).map((activity) => (
                        <li key={activity.id}>{activity.text}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No entries</p>
                  )}
                  {dayActivities.length > 3 && <span className="more-count">+{dayActivities.length - 3} more</span>}
                </article>
              )
            })}
          </div>
        </section>
      </div>

      <footer>
        <span className="footer-brand"><SparkIcon /> Daybook</span>
        <p className="footer-tagline">Small notes. Better recaps.</p>
        <p className="footer-credit">Made by Federico Moretti</p>
      </footer>

      <dialog
        aria-labelledby="history-modal-title"
        className="history-modal"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
        onClose={() => setSelectedHistoryDay(null)}
        ref={historyDialogRef}
      >
        {selectedHistoryDay && (
          <div className="history-modal-content">
            <div className="history-modal-heading">
              <div>
                <span className="section-kicker">Daily recap</span>
                <h2 id="history-modal-title">
                  {toDateKey(selectedHistoryDay) === todayKey ? 'Today' : formatWeekday(selectedHistoryDay)}
                </h2>
                <p>{formatDate(selectedHistoryDay)}</p>
              </div>
              <button
                aria-label="Close daily recap"
                className="modal-close-button"
                onClick={() => historyDialogRef.current?.close()}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {selectedHistoryActivities.length > 0 ? (
              <ol className="history-modal-list">
                {selectedHistoryActivities.map((activity) => (
                  <li key={activity.id}>
                    <span className="check-circle"><CheckIcon /></span>
                    <div>
                      <p>{activity.text}</p>
                      <time dateTime={activity.createdAt}>{formatTime(activity.createdAt)}</time>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="history-modal-empty">
                <span className="empty-line" />
                <h3>No activities recorded</h3>
                <p>There are no entries for this workday.</p>
              </div>
            )}
          </div>
        )}
      </dialog>

      <dialog
        aria-describedby="delete-confirmation-description"
        aria-labelledby="delete-confirmation-title"
        className="delete-confirmation-modal"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
        onClose={() => setActivityToDelete(null)}
        ref={deleteDialogRef}
      >
        {activityToDelete && (
          <div className="delete-confirmation-content">
            <span className="delete-confirmation-icon"><DeleteIcon /></span>
            <h2 id="delete-confirmation-title">Delete this entry?</h2>
            <p id="delete-confirmation-description">
              “{activityToDelete.text}” will be permanently removed. This cannot be undone.
            </p>
            <div className="delete-confirmation-actions">
              <button className="cancel-delete-button" onClick={() => deleteDialogRef.current?.close()} type="button">
                Cancel
              </button>
              <button className="confirm-delete-button" onClick={confirmDeleteActivity} type="button">
                Delete entry
              </button>
            </div>
          </div>
        )}
      </dialog>
    </main>
  )
}

export default App
