import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { LoaderComponent } from "../../../shared/components/loader/loader";

declare var bootstrap: any;

@Component({
  selector: 'app-update-vehicle-modal',
  templateUrl: './update-vehicle-modal.html',
  styleUrls: ['./update-vehicle-modal.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent]
})
export class UpdateVehicleModalComponent {
  @Input() vehicleId!: number;
  @Output() updated = new EventEmitter<void>();
  @Output() updating = new EventEmitter<boolean>(); // NEW: tells parent loader state

  editVehicle: any = null;
  removedImages: string[] = [];
  featureInput = '';
  newImages: File[] = [];
  newImagePreviews: { file: File; url: string }[] = [];
  isLoading = false;

  constructor(private vehicleService: VehicleService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleId'] && this.vehicleId) this.loadVehicle();
  }

  loadVehicle(): void {
    if (!this.vehicleId) return;
    this.updating.emit(true);
    this.vehicleService.getById(this.vehicleId).subscribe({
      next: vehicle => {
        this.editVehicle = structuredClone(vehicle);
        this.removedImages = [];
        this.newImages = [];
        this.updating.emit(false);
      },
      error: () => {
        this.updating.emit(false);
        alert('Failed to load vehicle details.');
      }
    });
  }

  removeImage(url: string): void {
    this.removedImages.push(url);
    this.editVehicle.images = this.editVehicle.images.filter((img: string) => img !== url);
  }

  onNewImages(event: any): void {
    const files = Array.from(event.target.files) as File[];
    files.forEach(file => {
      this.newImages.push(file);
      this.newImagePreviews.push({ file, url: URL.createObjectURL(file) });
    });
    event.target.value = '';
  }

  removeNewImage(file: File): void {
    this.newImages = this.newImages.filter(f => f !== file);
    const preview = this.newImagePreviews.find(p => p.file === file);
    if (preview) URL.revokeObjectURL(preview.url);
    this.newImagePreviews = this.newImagePreviews.filter(p => p.file !== file);
  }

  addFeature(): void {
    if (!this.featureInput.trim()) return;
    this.editVehicle.features.push(this.featureInput.trim());
    this.featureInput = '';
  }

  removeFeature(feature: string): void {
    this.editVehicle.features = this.editVehicle.features.filter((f: string) => f !== feature);
  }

  updateVehicle(): void {
    if (!this.editVehicle) return;
    this.updating.emit(true); // SHOW loader in parent

    const formData = new FormData();
    formData.append('Id', this.editVehicle.id);
    formData.append('Name', this.editVehicle.name);
    formData.append('Model', this.editVehicle.model);
    formData.append('Year', this.editVehicle.year);
    formData.append('Price', this.editVehicle.price);
    formData.append('Currency', this.editVehicle.currency);
    formData.append('InStock', this.editVehicle.inStock);
    formData.append('ShortDescription', this.editVehicle.shortDescription);
    formData.append('DetailedDescription', this.editVehicle.detailedDescription);
    this.removedImages.forEach(img => formData.append('RemovedImages', img));
    this.newImages.forEach(img => formData.append('NewImages', img));
    this.editVehicle.features.forEach((f: string) => formData.append('Features', f));
    Object.entries(this.editVehicle.specifications).forEach(([k, v]: any) =>
      formData.append(`Specifications.${k}`, v)
    );
    Object.entries(this.editVehicle.dimensions).forEach(([k, v]: any) =>
      formData.append(`Dimensions.${k}`, v)
    );

    this.vehicleService.update(this.editVehicle.id, formData).subscribe({
      next: () => {
        this.updating.emit(false);
        this.showSuccessToast();
        this.updated.emit(); // let parent reload vehicles and show toast
        bootstrap.Modal.getInstance(
          document.getElementById(`updateVehicleModal-${this.vehicleId}`)
        )?.hide();
      },
      error: () => {
        this.updating.emit(false);
        alert('Failed to update vehicle.');
      }
    });
  }

  private showSuccessToast(): void {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-success border-0';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.style.position = 'fixed';
    toastEl.style.bottom = '1rem';
    toastEl.style.right = '1rem';
    toastEl.style.zIndex = '2000'; // above modal

    toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">✅ Vehicle updated successfully</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

    document.body.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

}
