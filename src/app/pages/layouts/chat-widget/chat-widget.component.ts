import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Authentication} from '../../../core/models/auth.model';
import {AuthService} from '../../../core/services/auth.service';
import {
  ICON_CARET_LEFT,
  ICON_SEND_MESSAGE,
  ICON_SUPPORT_LARGER,
  ICON_USER,
  ICON_X_LARGER
} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {USER_TYPE} from '../../../constants/user.constants';
import {
  ChatMessageDTO,
  ChatMessageRequest,
  ChatMessagesFilter,
  ConversationDTO,
  ConversationMessage, Receiver
} from '../../../core/models/chat.model';
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
export class ChatWidgetComponent implements OnInit {
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
  topicName: string = '/user/topics/messages';
  sendMessageDestination: string = '/api/v1/messages/chats';
  senderName: string = '';

  constructor(private authService: AuthService, private websocketService: WebSocketService, private chatService: ChatService) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;

        if (this.authentication.type !== USER_TYPE.ADMIN) {
          if (this.authentication.type === USER_TYPE.SHOP && this.authentication.shopName) {
            this.senderName = this.authentication.shopName;
          } else {
            this.senderName = this.authentication.fullname;
          }

          this.active = true;
          this.websocketService.subscribeToTopic(this.topicName)
            .subscribe(message => this.handleMessage(message));
          this.loadConversations();
        }
      }
    });
  }

  ngOnInit() {
    this.chatService.openChat$.subscribe((receiver: Receiver) => {
      this.openChatWithShop(receiver);
    });
  }

  openChatWithShop(receiver: Receiver) {
    if (receiver.id > 0 && this.authentication.type === USER_TYPE.USER) {
      const conv = this.conversations.find(conversation =>
        conversation.partnerId === receiver.id
      );
      this.newMessage.content = 'Tôi cần hỗ trợ!';
      this.isChatVisible = true;

      if (conv) {
        this.handleChatLogic(conv).then(() => this.sendMessage());
      } else {
        this.createNewConversation(receiver.name, receiver.id);
      }
    }
  }

  async handleChatLogic(conv: ConversationDTO) {
    this.selectConversation(conv);
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;

    if (this.isChatVisible) {
      this.loadConversations();
    } else {
      this.selectedConversation = null;
    }
  }

  loadConversations(partnerId?: number) {
    const request: ChatMessagesFilter = {
      page: 0,
      size: 100,
      currentUserId: this.authentication.id,
      partnerId: partnerId || 0,
      isConversationDetail: false
    }

    this.chatService.getAllConversationWithPaging(request).subscribe(response => {
      this.conversations = (response.result || []).map(chatMessageDTO => {
        return {
          ...chatMessageDTO,
          messages: []
        } as ConversationDTO
      });

      if (partnerId && partnerId > 0) {
        const cnv = this.conversations.find(conversation =>
          conversation.partnerId === partnerId
        );

        if (cnv) {
          this.selectConversation(cnv);
        }
      }
    });
  }

  selectConversation(conv: ConversationDTO) {
    this.selectedConversation = conv;
    const request: ChatMessagesFilter = {
      page: 0,
      size: 10,
      currentUserId: this.authentication.id,
      partnerId: this.selectedConversation.partnerId,
      isConversationDetail: true
    }

    this.chatService.getAllConversationMessageWithPaging(request).subscribe(response => {
      if (this.selectedConversation && response.result) {
        this.selectedConversation.messages = response.result.map(chatMessageDTO => {
          return {
            senderId: chatMessageDTO.senderId,
            receiverId: chatMessageDTO.receiverId,
            content: chatMessageDTO.message.content,
            images: chatMessageDTO.message.images
          } as ConversationMessage
        });
      }
    });
  }

  backToList() {
    this.selectedConversation = null;
  }

  handleMessage(message: IMessage) {
    const chatMessageDTO = JSON.parse(message.body) as ChatMessageDTO;
    const conv = this.conversations.find(conversation =>
      conversation.partnerId === chatMessageDTO.senderId
    );
    this.isChatVisible = true;

    if (conv) {
      const newMessage: ConversationMessage = {
        senderId: chatMessageDTO.senderId,
        receiverId: chatMessageDTO.receiverId,
        content: chatMessageDTO.message.content,
        images: chatMessageDTO.message.images
      };

      if (!this.selectedConversation) {
        this.selectConversation(conv);
      } else {
        conv.messages.unshift(newMessage);
      }
    } else {
      this.loadConversations(chatMessageDTO.receiverId);
    }
  }

  sendMessage() {
    if (this.newMessage.content && this.selectedConversation) {
      this.newMessage.receiverName = this.selectedConversation.partnerName;
      this.newMessage.receiverId = this.selectedConversation.partnerId;
      this.newMessage.senderName = this.senderName;
      this.newMessage.senderId = this.authentication.id;
      this.websocketService.sendMessage(this.sendMessageDestination, this.newMessage);
      this.selectedConversation.messages.unshift({
        senderId: this.newMessage.senderId,
        receiverId: this.newMessage.receiverId,
        content: this.newMessage.content,
        images: this.newMessage.imageFiles
      });
      this.newMessage.content = '';
    }
  }

  createNewConversation(receiverName: string, receiverId: number) {
    if (this.newMessage.content) {
      this.newMessage.receiverName = receiverName;
      this.newMessage.receiverId = receiverId;
      this.newMessage.senderName = this.senderName;
      this.newMessage.senderId = this.authentication.id;
      this.websocketService.sendMessage(this.sendMessageDestination, this.newMessage);
      this.loadConversations(receiverId);
      this.newMessage.content = '';
    }
  }

  protected readonly ICON_SEND_MESSAGE = ICON_SEND_MESSAGE;
  protected readonly ICON_CARET_LEFT = ICON_CARET_LEFT;
  protected readonly ICON_SUPPORT_LARGER = ICON_SUPPORT_LARGER;
  protected readonly ICON_X_LARGER = ICON_X_LARGER;
  protected readonly ICON_USER = ICON_USER;
}
