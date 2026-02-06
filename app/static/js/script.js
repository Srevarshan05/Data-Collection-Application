// ===================================
// College Data Collection Application
// Main JavaScript File
// ===================================

// Year and Section Configuration
const YEAR_CONFIG = {
    1: {
        prefix: 'RA2511026050',
        sections: ['A', 'B', 'C', 'D', 'E']
    },
    2: {
        prefix: 'RA2411026050',
        sections: ['A', 'B', 'C', 'D', 'E']
    },
    3: {
        prefix: 'RA2311026050',
        sections: ['A', 'B', 'C', 'D']
    }
};

// DOM Elements
const yearSelect = document.getElementById('yearOfStudy');
const sectionSelect = document.getElementById('sectionAllocation');
const regNumberInput = document.getElementById('registrationNumber');
const regPrefix = document.getElementById('regPrefix');
const photoInput = document.getElementById('photoInput');
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const previewArea = document.getElementById('previewArea');
const imagePreview = document.getElementById('imagePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeImageBtn = document.getElementById('removeImage');
const registrationForm = document.getElementById('registrationForm');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');

let selectedFile = null;

// ===================================
// Year Selection Handler
// ===================================
yearSelect.addEventListener('change', function() {
    const year = parseInt(this.value);
    
    if (year && YEAR_CONFIG[year]) {
        // Update registration prefix
        regPrefix.textContent = YEAR_CONFIG[year].prefix;
        
        // Enable and populate section dropdown
        sectionSelect.disabled = false;
        sectionSelect.innerHTML = '<option value="" selected disabled>Select Section</option>';
        
        YEAR_CONFIG[year].sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = `Section ${section}`;
            sectionSelect.appendChild(option);
        });
        
        // Enable registration number input
        regNumberInput.disabled = false;
        
        // Clear previous values
        sectionSelect.value = '';
        regNumberInput.value = '';
        
        // Update helper text
        sectionSelect.nextElementSibling.nextElementSibling.textContent = 
            `Available sections: ${YEAR_CONFIG[year].sections.join(', ')}`;
    } else {
        // Reset if no year selected
        regPrefix.textContent = 'Select Year';
        sectionSelect.disabled = true;
        sectionSelect.innerHTML = '<option value="" selected disabled>Select Section</option>';
        regNumberInput.disabled = true;
        regNumberInput.value = '';
    }
});

// ===================================
// Registration Number Validation
// ===================================
regNumberInput.addEventListener('input', function() {
    // Only allow digits
    this.value = this.value.replace(/\D/g, '');
    
    // Limit to 3 digits
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3);
    }
    
    // Validate
    if (this.value.length === 3) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        
        // Check if registration number exists
        checkRegistrationNumber();
    } else {
        this.classList.remove('is-valid');
        if (this.value.length > 0) {
            this.classList.add('is-invalid');
        }
    }
});

// ===================================
// Check Registration Number Availability
// ===================================
async function checkRegistrationNumber() {
    const year = parseInt(yearSelect.value);
    const lastDigits = regNumberInput.value;
    
    if (!year || lastDigits.length !== 3) return;
    
    const fullRegNumber = YEAR_CONFIG[year].prefix + lastDigits;
    
    try {
        const response = await fetch(`/api/check-register-number/${fullRegNumber}`);
        const data = await response.json();
        
        if (data.exists) {
            regNumberInput.classList.remove('is-valid');
            regNumberInput.classList.add('is-invalid');
            
            // Show warning
            showToast('warning', 'Registration number already exists! Please use different last 3 digits.');
        }
    } catch (error) {
        console.error('Error checking registration number:', error);
    }
}

// ===================================
// Image Upload Handlers
// ===================================

// Click to upload
photoInput.addEventListener('change', handleFileSelect);

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle file processing
function handleFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showToast('error', 'Invalid file type! Please upload JPG or PNG image.');
        return;
    }
    
    // Validate file size (500KB)
    const maxSize = 500 * 1024; // 500KB in bytes
    if (file.size > maxSize) {
        showToast('error', `File size exceeds 500KB! Current size: ${formatFileSize(file.size)}`);
        return;
    }
    
    // Store file
    selectedFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        fileName.textContent = file.name;
        fileSize.textContent = `Size: ${formatFileSize(file.size)}`;
        
        // Show preview area, hide upload content
        uploadContent.classList.add('d-none');
        previewArea.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
}

// Remove image
removeImageBtn.addEventListener('click', () => {
    selectedFile = null;
    photoInput.value = '';
    imagePreview.src = '';
    fileName.textContent = '';
    fileSize.textContent = '';
    
    // Show upload content, hide preview area
    uploadContent.classList.remove('d-none');
    previewArea.classList.add('d-none');
});

// ===================================
// Form Submission
// ===================================
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!registrationForm.checkValidity()) {
        registrationForm.classList.add('was-validated');
        showToast('error', 'Please fill all required fields correctly!');
        return;
    }
    
    // Check if photo is uploaded
    if (!selectedFile) {
        showToast('error', 'Please upload a passport-size photo!');
        return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('name', document.getElementById('studentName').value.trim());
    formData.append('year', yearSelect.value);
    formData.append('section', sectionSelect.value);
    formData.append('last_digits', regNumberInput.value);
    formData.append('photo', selectedFile);
    
    // Show loading modal
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
    
    // Disable submit button
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Hide loading modal
        loadingModal.hide();
        
        if (response.ok && data.success) {
            // Success - redirect to success page
            showToast('success', 'Registration successful!');
            setTimeout(() => {
                window.location.href = `/success?register_number=${data.register_number}`;
            }, 1000);
        } else {
            // Error
            showToast('error', data.detail || 'Registration failed. Please try again.');
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        loadingModal.hide();
        showToast('error', 'An error occurred. Please check your connection and try again.');
        submitBtn.disabled = false;
    }
});

// ===================================
// Reset Form
// ===================================
resetBtn.addEventListener('click', () => {
    // Confirm reset
    if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
        registrationForm.reset();
        registrationForm.classList.remove('was-validated');
        
        // Reset custom elements
        regPrefix.textContent = 'Select Year';
        sectionSelect.disabled = true;
        sectionSelect.innerHTML = '<option value="" selected disabled>Select Section</option>';
        regNumberInput.disabled = true;
        
        // Reset image
        if (selectedFile) {
            removeImageBtn.click();
        }
        
        // Reset validation classes
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
        showToast('info', 'Form has been reset');
    }
});

// ===================================
// Utility Functions
// ===================================

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Show toast notification
function showToast(type, message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Toast colors
    const colors = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };
    
    // Toast icons
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    // Create toast
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${colors[type]} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${icons[type]} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// ===================================
// Form Validation Enhancement
// ===================================
(function() {
    'use strict';
    
    // Add real-time validation
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });
})();

// ===================================
// Page Load Animations
// ===================================
window.addEventListener('load', () => {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});

// ===================================
// Prevent form resubmission on refresh
// ===================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

console.log('✅ College Data Collection Application - JavaScript Loaded Successfully');
