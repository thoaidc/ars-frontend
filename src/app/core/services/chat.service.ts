import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_CHAT} from '../../constants/api.constants';
import {ChatMessageDTO, ChatMessagesFilter} from '../models/chat.model';
import {Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private chatAPI = this.applicationConfigService.getEndpointFor(API_CHAT);

  getAllWithPaging(request: ChatMessagesFilter): Observable<BaseResponse<ChatMessageDTO[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<ChatMessageDTO[]>>(this.chatAPI, {params: params});
  }
}
