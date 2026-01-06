// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { VehicleService } from '../../../core/services/vehicle.service';
// import { LoaderComponent } from '../../../shared/components/loader/loader';
// import { CommonModule } from '@angular/common';

// declare var bootstrap: any;

// @Component({
//   selector: 'app-create-vehicle-modal',
//   templateUrl: './create-vehicle-modal.html',
//   styleUrls: ['./create-vehicle-modal.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent]
// })
// export class CreateVehicleModalComponent {

//   vehicleForm: FormGroup;
//   features: string[] = [];
//   newFeature = '';
//   selectedImages: File[] = [];
//   imagePreviews: string[] = [];
//   showLoader = false;

//   @Output() vehicleCreated = new EventEmitter<void>();

//   constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
//     this.vehicleForm = this.fb.group({
//       name: [''],
//       model: [''],
//       year: [''],
//       price: [''],
//       currency: ['INR'],
//       inStock: [true],
//       shortDescription: [''],
//       detailedDescription: [''],

//       engine: [''],
//       power: [''],
//       torque: [''],
//       fuelType: [''],
//       transmission: [''],
//       mileage: [''],
//       topSpeed: [''],
//       acceleration: [''],
//       seating: [''],
//       bodyType: [''],
//       drivetrain: [''],

//       length: [''],
//       width: [''],
//       height: [''],
//       wheelbase: [''],
//       bootSpace: ['']
//     });
//   }

//   /* ================= FEATURES ================= */
//   addFeature(): void {
//     const value = this.newFeature.trim();
//     if (value && !this.features.includes(value)) this.features.push(value);
//     this.newFeature = '';
//   }

//   removeFeature(index: number): void {
//     this.features.splice(index, 1);
//   }

//   /* ================= IMAGES ================= */
//   onImagesSelected(event: any): void {
//     const files: File[] = Array.from(event.target.files);

//     files.forEach(file => {
//       this.selectedImages.push(file);

//       const reader = new FileReader();
//       reader.onload = () => this.imagePreviews.push(reader.result as string);
//       reader.readAsDataURL(file);
//     });

//     event.target.value = '';
//   }

//   removeImage(index: number): void {
//     this.selectedImages.splice(index, 1);
//     this.imagePreviews.splice(index, 1);
//   }

//   /* ================= SUBMIT VEHICLE ================= */
//   submitVehicle(): void {
//     if (this.vehicleForm.invalid) return;

//     this.showLoader = true;
//     const f = this.vehicleForm.value;
//     const formData = new FormData();

//     formData.append('Name', f.name);
//     formData.append('Model', f.model);
//     formData.append('Year', f.year);
//     formData.append('Price', f.price);
//     formData.append('Currency', f.currency);
//     formData.append('InStock', f.inStock);
//     formData.append('ShortDescription', f.shortDescription);
//     formData.append('DetailedDescription', f.detailedDescription);

//     this.features.forEach(feat => formData.append('Features', feat));
//     this.selectedImages.forEach(img => formData.append('Images', img));

//     Object.entries({
//       'Specifications.Engine': f.engine,
//       'Specifications.Power': f.power,
//       'Specifications.Torque': f.torque,
//       'Specifications.FuelType': f.fuelType,
//       'Specifications.Transmission': f.transmission,
//       'Specifications.Mileage': f.mileage,
//       'Specifications.TopSpeed': f.topSpeed,
//       'Specifications.Acceleration': f.acceleration,
//       'Specifications.Seating': f.seating,
//       'Specifications.BodyType': f.bodyType,
//       'Specifications.Drivetrain': f.drivetrain,

//       'Dimensions.Length': f.length,
//       'Dimensions.Width': f.width,
//       'Dimensions.Height': f.height,
//       'Dimensions.Wheelbase': f.wheelbase,
//       'Dimensions.BootSpace': f.bootSpace
//     }).forEach(([k, v]) => formData.append(k, v as any));

//     this.vehicleService.create(formData).subscribe({
//       next: () => {
//         this.showLoader = false;
//         this.vehicleForm.reset({ currency: 'INR', inStock: true });
//         this.features = [];
//         this.selectedImages = [];
//         this.imagePreviews = [];

//         this.vehicleCreated.emit(); // Notify parent to reload listing

//         // Close modal
//         (window as any).bootstrap.Modal.getInstance(
//           document.getElementById('addVehicleModal')
//         )?.hide();

//         this.showToast('Vehicle created successfully');
//       },
//       error: () => {
//         this.showLoader = false;
//         this.showToast('Failed to create vehicle', true);
//       }
//     });
//   }

//   showToast(message: string, isError = false): void {
//     const toastEl = document.createElement('div');
//     toastEl.className = `toast align-items-center text-white ${isError ? 'bg-danger' : 'bg-success'} border-0`;
//     toastEl.setAttribute('role', 'alert');
//     toastEl.setAttribute('aria-live', 'assertive');
//     toastEl.setAttribute('aria-atomic', 'true');
//     toastEl.innerHTML = `
//       <div class="d-flex">
//         <div class="toast-body">${message}</div>
//         <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//       </div>
//     `;
//     document.body.appendChild(toastEl);
//     const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
//     toast.show();
//     toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
//   }
// }



import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-create-vehicle-modal',
  templateUrl: './create-vehicle-modal.html',
  styleUrls: ['./create-vehicle-modal.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent]
})
export class CreateVehicleModalComponent {

  vehicleForm: FormGroup;
  features: string[] = [];
  newFeature = '';
  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  showLoader = false;

  @Output() vehicleCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {

    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      price: ['', [Validators.required, Validators.min(1)]],
      currency: ['INR', Validators.required],
      inStock: [true, Validators.required],

      shortDescription: ['', Validators.required],
      detailedDescription: ['', Validators.required],

      engine: ['', Validators.required],
      power: ['', Validators.required],
      torque: ['', Validators.required],
      fuelType: ['', Validators.required],
      transmission: ['', Validators.required],
      mileage: ['', Validators.required],
      topSpeed: ['', Validators.required],
      acceleration: ['', Validators.required],
      seating: ['', Validators.required],
      bodyType: ['', Validators.required],
      drivetrain: ['', Validators.required],

      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      wheelbase: ['', Validators.required],
      bootSpace: ['', Validators.required]
    });
  }

  /* ================= FEATURES ================= */
  addFeature(): void {
    const value = this.newFeature.trim();
    if (value && !this.features.includes(value)) {
      this.features.push(value);
    }
    this.newFeature = '';
  }

  removeFeature(index: number): void {
    this.features.splice(index, 1);
  }

  /* ================= IMAGES ================= */
  onImagesSelected(event: any): void {
    const files: File[] = Array.from(event.target.files);

    files.forEach(file => {
      this.selectedImages.push(file);

      const reader = new FileReader();
      reader.onload = () => this.imagePreviews.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  /* ================= SUBMIT ================= */
  submitVehicle(): void {

    if (
      this.vehicleForm.invalid ||
      this.features.length === 0 ||
      this.selectedImages.length === 0
    ) {
      this.vehicleForm.markAllAsTouched();
      this.showToast('Please fill all required fields', true);
      return;
    }

    this.showLoader = true;
    const f = this.vehicleForm.value;
    const formData = new FormData();

    formData.append('Name', f.name);
    formData.append('Model', f.model);
    formData.append('Year', f.year);
    formData.append('Price', f.price);
    formData.append('Currency', f.currency);
    formData.append('InStock', String(f.inStock));
    formData.append('ShortDescription', f.shortDescription);
    formData.append('DetailedDescription', f.detailedDescription);

    this.features.forEach(feat => formData.append('Features', feat));
    this.selectedImages.forEach(img => formData.append('Images', img));

    Object.entries({
      'Specifications.Engine': f.engine,
      'Specifications.Power': f.power,
      'Specifications.Torque': f.torque,
      'Specifications.FuelType': f.fuelType,
      'Specifications.Transmission': f.transmission,
      'Specifications.Mileage': f.mileage,
      'Specifications.TopSpeed': f.topSpeed,
      'Specifications.Acceleration': f.acceleration,
      'Specifications.Seating': f.seating,
      'Specifications.BodyType': f.bodyType,
      'Specifications.Drivetrain': f.drivetrain,

      'Dimensions.Length': f.length,
      'Dimensions.Width': f.width,
      'Dimensions.Height': f.height,
      'Dimensions.Wheelbase': f.wheelbase,
      'Dimensions.BootSpace': f.bootSpace
    }).forEach(([k, v]) => formData.append(k, v as any));

    this.vehicleService.create(formData).subscribe({
      next: () => {
        this.showLoader = false;
        this.vehicleForm.reset({ currency: 'INR', inStock: true });
        this.features = [];
        this.selectedImages = [];
        this.imagePreviews = [];

        this.vehicleCreated.emit();

        (window as any).bootstrap.Modal
          .getInstance(document.getElementById('addVehicleModal'))
          ?.hide();

        this.showToast('Vehicle created successfully');
      },
      error: () => {
        this.showLoader = false;
        this.showToast('Failed to create vehicle', true);
      }
    });
  }

  showToast(message: string, isError = false): void {
    const toastEl = document.createElement('div');
    toastEl.className = `toast text-white ${isError ? 'bg-danger' : 'bg-success'} border-0`;
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    document.body.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
}