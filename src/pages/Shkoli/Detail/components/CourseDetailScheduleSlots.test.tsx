import { cleanup, render, screen } from '@testing-library/react'
import type { TFunction } from 'i18next'
import { afterEach, describe, expect, it } from 'vitest'

import type { CourseScheduleSlot } from '../../../../types/courses'
import { CourseDetailScheduleSlots } from './CourseDetailScheduleSlots'

const t = ((key: string, options?: Record<string, unknown>) => {
  if (key === 'pages.shkoli.detail.schedule.dayOfWeek') {
    return 'Day of week'
  }
  if (key === 'pages.shkoli.detail.schedule.time') {
    return 'Time'
  }
  if (key === 'pages.shkoli.detail.schedule.duration') {
    return 'Single class duration'
  }
  if (key === 'pages.shkoli.detail.schedule.minutes') {
    return `${options?.count} minutes`
  }
  if (key === 'courses.daysOfWeek.TUESDAY') {
    return 'Tuesday'
  }
  return key
}) as unknown as TFunction

const baseSlot: CourseScheduleSlot = {
  recurrence: 'WEEKLY',
  dayOfWeek: 'TUESDAY',
  startTime: '17:30:00',
  endTime: '18:30:00',
}

describe('CourseDetailScheduleSlots', () => {
  afterEach(() => {
    cleanup()
  })

  it('hides the duration row when the slot duration is not provided', () => {
    render(
      <CourseDetailScheduleSlots
        scheduleSlots={[baseSlot]}
        fallbackValue="Not provided"
        t={t}
      />,
    )

    expect(screen.getByText('Time')).toBeTruthy()
    expect(screen.getByText('17:30 - 18:30')).toBeTruthy()
    expect(screen.queryByText('Single class duration')).toBeNull()
    expect(screen.queryByText('Not provided')).toBeNull()
  })

  it('shows the duration row when the slot duration is provided', () => {
    render(
      <CourseDetailScheduleSlots
        scheduleSlots={[
          {
            ...baseSlot,
            singleClassDurationMinutes: 60,
          },
        ]}
        fallbackValue="Not provided"
        t={t}
      />,
    )

    expect(screen.getByText('Single class duration')).toBeTruthy()
    expect(screen.getByText('60 minutes')).toBeTruthy()
  })
})
