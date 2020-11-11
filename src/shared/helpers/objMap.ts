export const objMap = (obj, func: (key: string, value: any) => any) => {
  for (let key in obj) func(key, obj[key])
}
