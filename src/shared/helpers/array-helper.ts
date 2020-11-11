export const getFromObect = (objs, elems: string[] = []) => {
  const result: any = {}

  elems.forEach(item => (result[item] = objs[item]))

  return result
}

export const removeNulls = <T>(obj: T): T => {
  const result: {} = {}

  Object.keys(obj).forEach(key => {
    if (obj[key]) result[key] = obj[key]
  })

  return result as T
}
