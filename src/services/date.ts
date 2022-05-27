import moment from 'moment'

export const getDates = () => {
  const tz = new Date().getTimezoneOffset()
  const start = moment(new Date(`${process.env.NEXT_PUBLIC_DATE}`)).utc()
  const end = moment().utc().subtract(tz, 'minutes')

  return end.diff(start, 'days')
}