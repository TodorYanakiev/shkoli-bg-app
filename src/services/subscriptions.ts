import httpClient from './httpClient'

export const subscribeToCourse = async (courseId: number) => {
  await httpClient.post(`/api/v1/courses/${courseId}/subscribe`)
}

export const unsubscribeFromCourse = async (courseId: number) => {
  await httpClient.delete(`/api/v1/courses/${courseId}/subscribe`)
}

export const subscribeToLyceum = async (lyceumId: number) => {
  await httpClient.post(`/api/v1/lyceums/${lyceumId}/subscribe`)
}

export const unsubscribeFromLyceum = async (lyceumId: number) => {
  await httpClient.delete(`/api/v1/lyceums/${lyceumId}/subscribe`)
}
