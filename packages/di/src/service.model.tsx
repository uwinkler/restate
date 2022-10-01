export interface ServiceUpdateMessage<T> {
  type: 'ServiceUpdateMessage'
  name: string
  update: T
}

export interface ReplaceServiceCommand {
  type: 'ReplaceServiceCommand'
  name: string
  ticket: string
}

export interface RestoreServiceCommand {
  type: 'RestoreServiceCommand'
  name: string
}
