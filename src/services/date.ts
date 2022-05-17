import { 
  startOfDay, 
  getUnixTime, 
  secondsToHours 
} from 'date-fns'

export const getDates = () => {
  const firstDay = getUnixTime(startOfDay(new Date(`${process.env.NEXT_PUBLIC_DATE}`)))
  const currentDay = getUnixTime(new Date())
  const days = Math.floor(secondsToHours(currentDay - firstDay)/24)
  return days > 0 ? days -1 : days 
}