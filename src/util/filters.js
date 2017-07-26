import format from 'date-fns/format'

export const fmtTime = (time) => {
  return format(time, 'YYYY-MM-DD HH:mm')
}

export const truncate = (str, size) => {
  if (str.length <= size) {
    return str
  } else {
    return str.substr(0, size) + ' ...'
  }
}
