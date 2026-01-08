import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Authentication} from '../../../core/models/auth.model';
import {AuthService} from '../../../core/services/auth.service';
import {
  ICON_CARET_LEFT,
  ICON_SEND_MESSAGE,
  ICON_SUPPORT_LARGER,
  ICON_X_LARGER
} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {USER_TYPE} from '../../../constants/user.constants';
import {ChatMessage, ChatMessageRequest, ChatMessagesFilter, ConversationDTO} from '../../../core/models/chat.model';
import {WebSocketService} from '../../../core/services/websocket.service';
import {IMessage} from '@stomp/stompjs';
import {ChatService} from '../../../core/services/chat.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    NgIf,
    SafeHtmlPipe
  ],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss'
})
export class ChatWidgetComponent {
  isChatVisible = false;
  conversations: ConversationDTO[] = [];
  selectedConversation: ConversationDTO | null = null;
  newMessage: ChatMessageRequest = {
    senderId: 0,
    receiverId: 0,
    content: '',
    senderName: '',
    receiverName: ''
  };
  authentication!: Authentication;
  active: boolean = false;
  topicName: string = '/user/topics/message';
  sendMessageDestination: string = '/api/v1/messages/chats';

  constructor(private authService: AuthService, private websocketService: WebSocketService, private chatService: ChatService) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;

        if (this.authentication.type !== USER_TYPE.ADMIN) {
          this.active = true;
          this.websocketService.subscribeToTopic(this.topicName)
            .subscribe(message => this.handleMessage(message));
          this.loadConversations();
        }
      }
    });
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  loadConversations() {
    const request: ChatMessagesFilter = {
      page: 0,
      size: 100,
      senderId: this.authentication.id,
      receiverId: 0,
      isConversationDetail: false
    }

    this.chatService.getAllWithPaging(request).subscribe(response => {
      this.conversations = (response.result || []).map(res => {
        return {
          receiverId: res.receiverId,
          receiverName: res.receiverName,
          senderId: this.authentication.id,
          senderName: this.authentication.fullname,
          createdDate: res.createdDate,
          lastMessage: res.content
        } as ConversationDTO
      });
    });
  }

  selectConversation(conv: ConversationDTO) {
    this.selectedConversation = conv;
    const request: ChatMessagesFilter = {
      page: 0,
      size: 10,
      senderId: this.authentication.id,
      receiverId: this.selectedConversation.receiverId,
      isConversationDetail: true
    }

    this.chatService.getAllWithPaging(request).subscribe(response => {
      if (this.selectedConversation && response.result) {
        this.selectedConversation.messages = response.result.map(res => {
          return {
            senderId: res.senderId,
            receiverId: res.receiverId,
            content: res.content
          } as ChatMessage;
        });
      }
    });
  }

  backToList() {
    this.selectedConversation = null;
  }

  handleMessage(message: IMessage) {

  }

  sendMessage() {
    if (this.newMessage.content && this.selectedConversation) {
      this.newMessage.receiverName = this.selectedConversation.receiverName;
      this.newMessage.receiverId = this.selectedConversation.receiverId;
      this.newMessage.senderName = this.authentication.fullname;
      this.newMessage.senderId = this.authentication.id;
      this.websocketService.sendMessage(this.sendMessageDestination, this.newMessage);
    }
  }

  protected readonly ICON_SEND_MESSAGE = ICON_SEND_MESSAGE;
  protected readonly ICON_CARET_LEFT = ICON_CARET_LEFT;
  protected readonly ICON_SUPPORT_LARGER = ICON_SUPPORT_LARGER;
  protected readonly ICON_X_LARGER = ICON_X_LARGER;
}
