import { 
  startOfDay, 
  differenceInDays, 
  format
} from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const getDates = () => {
  const timeZone = 'America/Sao_Paulo'
  const type =`yyyy-MM-dd'T'HH:mm:ss.SSSxxx`

  const firstDay = utcToZonedTime(
    format(startOfDay(new Date(`${process.env.NEXT_PUBLIC_DATE}T00:00:00Z`)), type),
    timeZone
  )
  const date = utcToZonedTime(
    format(new Date(), type),
    timeZone
  )

  let days = differenceInDays(date, firstDay)
  days = days > 0 ? days -1 : days 

  return days
}