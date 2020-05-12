import moment from 'moment'


/**
 * format the dates params
 * @param {object} param dates by key
 * @return {object} formatted dates by key
 */
export const formatDateParam = (param: {[key: string]: any}): {[key: string]: string} => {
  return Object.entries(param).reduce((acc: {[key: string]: string}, [key, value]: [string, Date]) => {
    acc[key] = value instanceof Date ? moment(value).format('YYYY-MM-DD') : value
    return acc
  }, {})
}