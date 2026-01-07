import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_CHAT} from '../../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private chatAPI = this.applicationConfigService.getEndpointFor(API_CHAT);

}
