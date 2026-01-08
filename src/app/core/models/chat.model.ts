import {BaseFilterRequest} from './request.model';
import {AuditingEntity} from './common.model';

export interface ChatMessagesFilter extends BaseFilterRequest {
  currentUserId: number;
  partnerId: number;
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

export interface ConversationDTO {
  partnerId: number;
  partnerName: string;
  latestMessageTime: string;
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

export interface Receiver {
  id: number;
  name: string;
}
