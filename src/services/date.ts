import moment from 'moment'

export const getDates = () => {
  const characters = parseInt(process.env.NEXT_PUBLIC_CHARACTERS)

  const tz = new Date().getTimezoneOffset()
  const start = moment(new Date(`${process.env.NEXT_PUBLIC_DATE}`)).utc()
  const end = moment().utc().subtract(tz, 'minutes')

  let days = end.diff(start, 'days')

  if(days > characters) {
    const repeatNumber = days/characters >= 1 ? Math.trunc(days/characters) : 1
    days -= characters*repeatNumber
  }

  return days > 0 ? days - 1 : days
}