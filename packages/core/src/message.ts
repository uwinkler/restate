export interface Message {
  type: string
}

export enum RestateMessageType {
  INIT = '@Restate/Core/Init',
  UPDATE = '@Restate/Core/Update'
}

export interface RestateUpdateMessage extends Message {
  type: RestateMessageType.UPDATE
}

export const RESTATE_UPDATE_MESSAGE: Message = {
  type: RestateMessageType.UPDATE
}

export interface RestateInitMessage extends Message {
  type: RestateMessageType.INIT
}

export const RESTATE_INIT_MESSAGE: Message = {
  type: RestateMessageType.INIT
}

export type RestateMessage = RestateUpdateMessage | RestateInitMessage
