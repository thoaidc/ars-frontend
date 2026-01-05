import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {DecimalPipe, NgIf} from '@angular/common';
import {OrderService} from '../../../../core/services/order.service';

@Component({
  selector: 'app-upload-design',
  standalone: true,
  templateUrl: './upload-design-file.component.html',
  imports: [
    DecimalPipe,
    NgIf
  ],
  styleUrls: ['./upload-design-file.component.scss']
})
export class UploadDesignComponent {
  @Input() orderProductId!: number;
  selectedFile: File | null = null;
  isDragging = false;
  isUploading = false;
  uploadProgress = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    this.handleFile(file);
  }

  handleFile(file: File | undefined) {
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension) {
      this.toastr.error('Định dạng file không hợp lệ!');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      this.toastr.error('Dung lượng file quá lớn (Tối đa 20MB)!');
      return;
    }

    this.selectedFile = file;
  }

  removeFile() {
    this.selectedFile = null;
  }

  upload() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('orderProductId', '' + this.orderProductId);

    this.orderService.uploadDesign(formData).subscribe({
      next: () => {
        this.toastr.success('Tải lên thành công');
        this.activeModal.close();
      },
      error: () => this.isUploading = false
    });
  }
}
