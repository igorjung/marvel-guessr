import moment from 'moment'

export const getDates = () => {
  const tz = new Date().getTimezoneOffset()
  const start = moment(new Date(`${process.env.NEXT_PUBLIC_DATE}`)).utc()
  const end = moment().utc().subtract(tz, 'minutes')

  const days = end.diff(start, 'days')

  return days > 0 ? days - 1 : days
}