export function isFunction(method: any): method is Function {
  return method && typeof method === 'function'
}
