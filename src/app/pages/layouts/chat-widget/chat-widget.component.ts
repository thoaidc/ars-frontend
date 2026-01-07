import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Authentication} from '../../../core/models/auth.model';
import {AuthService} from '../../../core/services/auth.service';
import {
  ICON_CARET_LEFT,
  ICON_CARET_RIGHT,
  ICON_CHART,
  ICON_PLAY,
  ICON_SEND_MESSAGE,
  ICON_SUPPORT_LARGER, ICON_X_LARGER
} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {USER_TYPE} from '../../../constants/user.constants';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  isOpen: boolean;
}

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
  selectedConversation: Conversation | null = null;
  newMessage = '';
  authentication!: Authentication;
  active: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;

        if (this.authentication.type !== USER_TYPE.ADMIN) {
          this.active = true;
        }
      }
    })
  }

  conversations: Conversation[] = [
    { id: 1, title: 'Hỗ trợ kỹ thuật', messages: [], isOpen: false },
    { id: 2, title: 'Tư vấn bán hàng', messages: [], isOpen: false }
  ];

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation = conv;
  }

  backToList() {
    this.selectedConversation = null;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedConversation) {
      this.selectedConversation.messages.push({
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });
      this.newMessage = '';

      // Giả lập bot phản hồi
      setTimeout(() => {
        this.selectedConversation?.messages.push({
          text: 'Cảm ơn bạn, chúng tôi đã nhận được tin nhắn!',
          sender: 'bot',
          timestamp: new Date()
        });
      }, 1000);
    }
  }

  protected readonly ICON_SEND_MESSAGE = ICON_SEND_MESSAGE;
  protected readonly ICON_CARET_LEFT = ICON_CARET_LEFT;
  protected readonly ICON_SUPPORT_LARGER = ICON_SUPPORT_LARGER;
  protected readonly ICON_X_LARGER = ICON_X_LARGER;
}
