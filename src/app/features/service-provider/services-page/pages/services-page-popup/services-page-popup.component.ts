import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-services-page-popup',
  standalone: false,
  templateUrl: './services-page-popup.component.html',
  styleUrl: './services-page-popup.component.css'
})
export class ServicesPagePopupComponent {


  editorModules = {
  toolbar: [
   
    ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'] 
                                
  ],
}
  areaForm: FormGroup;

  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.areaForm = this.fb.group({
      description: ['', Validators.required],
      serviceType: ['',Validators.required],
      note: ['', Validators.required], 
      enforceCellNumber:[false],
      sendReferenceNumber:[false],
      isActive: [false],
    });
  }
  
  

  onSubmit() {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched(); // Highlight validation errors
      return;
    }
    const formData = this.areaForm.value;
    console.log('Form submitted:', formData);

    this.formSubmit.emit(formData);

    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
  
}