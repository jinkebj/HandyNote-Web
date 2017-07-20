import format from 'date-fns/format'

export const fmtTime = (time) => {
  return format(time, 'YYYY-MM-DD HH:mm')
}
