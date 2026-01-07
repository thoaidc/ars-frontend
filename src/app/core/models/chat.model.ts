import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface ChatMessagesFilter extends BaseFilterRequest {
  senderId: number;
  receiverId: number;
  isConversationDetail: boolean;
}

export interface ConversationDTO extends AuditingEntity {
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  content: string;
  images?: string[];
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
