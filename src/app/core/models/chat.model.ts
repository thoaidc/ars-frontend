import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface ChatMessagesFilter extends BaseFilterRequest {
  senderId: number;
  receiverId: number;
  isConversationDetail: boolean;
}

export interface ChatMessageDTO extends AuditingEntity {
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message: ChatMessageDetailDTO;
}

export interface ChatMessageDetailDTO {
  content: string;
  images?: string[];
}

export interface ConversationDTO extends ChatMessageDTO {
  messages: ConversationMessage[];
}

export interface ConversationMessage extends ChatMessageDetailDTO {
  senderId: number;
  receiverId: number;
}

export interface ChatMessageRequest {
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  imageFiles?: any[];
}
