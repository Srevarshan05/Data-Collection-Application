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
const retakeBtn = document.getElementById('retakeBtn');
const registrationForm = document.getElementById('registrationForm');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');

// Camera elements
const cameraBtn = document.getElementById('cameraBtn');
const cameraArea = document.getElementById('cameraArea');
const cameraVideo = document.getElementById('cameraVideo');
const cameraCanvas = document.getElementById('cameraCanvas');
const captureBtn = document.getElementById('captureBtn');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');

// iPad elements
const ipadYes = document.getElementById('ipadYes');
const ipadNo = document.getElementById('ipadNo');
const macAddressField = document.getElementById('macAddressField');
const ipadMacAddress = document.getElementById('ipadMacAddress');

// Signature elements
const signatureInput = document.getElementById('signatureInput');
const signatureUploadArea = document.getElementById('signatureUploadArea');
const signatureUploadContent = document.getElementById('signatureUploadContent');
const signaturePreviewArea = document.getElementById('signaturePreviewArea');
const signaturePreview = document.getElementById('signaturePreview');
const signatureFileName = document.getElementById('signatureFileName');
const signatureFileSize = document.getElementById('signatureFileSize');
const removeSignatureBtn = document.getElementById('removeSignature');

let selectedFile = null;
let selectedSignature = null;
let cameraStream = null;
let currentFacingMode = 'environment'; // Start with rear camera (better quality)
let signatureCameraStream = null;
let currentSignatureFacingMode = 'environment'; // Start with rear camera

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

// Retake photo
retakeBtn.addEventListener('click', () => {
    removeImageBtn.click();
});

// ===================================
// Camera Capture Functionality
// ===================================

// Open camera
cameraBtn.addEventListener('click', async () => {
    await startCamera(currentFacingMode);
});

// Function to start camera with specified facing mode
async function startCamera(facingMode) {
    try {
        // Stop existing stream if any
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        
        // Request camera access with specified facing mode
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: facingMode,
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        
        // Set video source
        cameraVideo.srcObject = cameraStream;
        
        // Show camera area, hide upload content
        uploadContent.classList.add('d-none');
        cameraArea.classList.remove('d-none');
        
        const cameraType = facingMode === 'user' ? 'Front' : 'Rear';
        showToast('info', `${cameraType} camera ready! Position yourself and click "Take Photo"`);
    } catch (error) {
        console.error('Error accessing camera:', error);
        
        let errorMessage = 'Unable to access camera. ';
        if (error.name === 'NotAllowedError') {
            errorMessage += 'Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'No camera found on this device.';
        } else if (error.name === 'OverconstrainedError') {
            errorMessage += 'Requested camera not available. Trying default camera...';
            // Try with default camera
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 640 },
                        height: { ideal: 480 }
                    } 
                });
                cameraVideo.srcObject = cameraStream;
                uploadContent.classList.add('d-none');
                cameraArea.classList.remove('d-none');
                showToast('info', 'Camera ready! Position yourself and click "Take Photo"');
                return;
            } catch (fallbackError) {
                errorMessage = 'Unable to access any camera.';
            }
        } else {
            errorMessage += 'Please check your camera permissions.';
        }
        
        showToast('error', errorMessage);
    }
}

// Switch camera button handler
if (switchCameraBtn) {
    switchCameraBtn.addEventListener('click', async () => {
        // Toggle facing mode
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        await startCamera(currentFacingMode);
    });
}

// Capture photo
captureBtn.addEventListener('click', () => {
    // Set canvas size to match video
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    
    // Draw video frame to canvas
    const context = cameraCanvas.getContext('2d');
    context.drawImage(cameraVideo, 0, 0);
    
    // Convert canvas to blob
    cameraCanvas.toBlob((blob) => {
        // Create file from blob
        const timestamp = new Date().getTime();
        const file = new File([blob], `camera_capture_${timestamp}.jpg`, { 
            type: 'image/jpeg' 
        });
        
        // Validate file size
        const maxSize = 500 * 1024; // 500KB
        if (file.size > maxSize) {
            showToast('warning', 'Captured image is too large. Compressing...');
            
            // Compress image
            compressImage(cameraCanvas, (compressedBlob) => {
                const compressedFile = new File([compressedBlob], `camera_capture_${timestamp}.jpg`, { 
                    type: 'image/jpeg' 
                });
                
                if (compressedFile.size > maxSize) {
                    showToast('error', 'Unable to compress image below 500KB. Please try again with better lighting.');
                    return;
                }
                
                processCapture(compressedFile);
            });
        } else {
            processCapture(file);
        }
    }, 'image/jpeg', 0.9);
});

// Process captured photo
function processCapture(file) {
    // Store file
    selectedFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        fileName.textContent = file.name;
        fileSize.textContent = `Size: ${formatFileSize(file.size)}`;
        
        // Hide camera area, show preview
        cameraArea.classList.add('d-none');
        previewArea.classList.remove('d-none');
        
        // Stop camera
        stopCamera();
        
        showToast('success', 'Photo captured successfully!');
    };
    reader.readAsDataURL(file);
}

// Close camera
closeCameraBtn.addEventListener('click', () => {
    stopCamera();
    
    // Show upload content, hide camera area
    cameraArea.classList.add('d-none');
    uploadContent.classList.remove('d-none');
});

// Stop camera stream
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        cameraVideo.srcObject = null;
    }
}

// Compress image
function compressImage(canvas, callback) {
    // Try different quality levels
    const qualities = [0.7, 0.6, 0.5, 0.4];
    let qualityIndex = 0;
    
    function tryCompress() {
        canvas.toBlob((blob) => {
            if (blob.size <= 500 * 1024 || qualityIndex >= qualities.length - 1) {
                callback(blob);
            } else {
                qualityIndex++;
                tryCompress();
            }
        }, 'image/jpeg', qualities[qualityIndex]);
    }
    
    tryCompress();
}

// ===================================
// iPad Toggle Handler
// ===================================
ipadYes.addEventListener('change', function() {
    if (this.checked) {
        macAddressField.classList.remove('d-none');
        ipadMacAddress.required = true;
    }
});

ipadNo.addEventListener('change', function() {
    if (this.checked) {
        macAddressField.classList.add('d-none');
        ipadMacAddress.required = false;
        ipadMacAddress.value = '';
        ipadMacAddress.classList.remove('is-valid', 'is-invalid');
    }
});

// MAC Address formatting
ipadMacAddress.addEventListener('input', function() {
    // Remove all non-hex characters
    let value = this.value.replace(/[^0-9A-Fa-f]/g, '');
    
    // Add colons every 2 characters
    let formatted = '';
    for (let i = 0; i < value.length && i < 12; i++) {
        if (i > 0 && i % 2 === 0) {
            formatted += ':';
        }
        formatted += value[i];
    }
    
    this.value = formatted.toUpperCase();
});

// ===================================
// Signature Upload Handlers
// ===================================
signatureInput.addEventListener('change', handleSignatureSelect);

function handleSignatureSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleSignatureFile(file);
    }
}

function handleSignatureFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showToast('error', 'Invalid signature file type! Please upload JPG or PNG image.');
        return;
    }
    
    // Validate file size (500KB)
    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
        showToast('error', `Signature file size exceeds 500KB! Current size: ${formatFileSize(file.size)}`);
        return;
    }
    
    // Store file
    selectedSignature = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        signaturePreview.src = e.target.result;
        signatureFileName.textContent = file.name;
        signatureFileSize.textContent = `Size: ${formatFileSize(file.size)}`;
        
        // Show preview area, hide upload content
        signatureUploadContent.classList.add('d-none');
        signaturePreviewArea.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
}

// Remove signature
removeSignatureBtn.addEventListener('click', () => {
    selectedSignature = null;
    signatureInput.value = '';
    signaturePreview.src = '';
    signatureFileName.textContent = '';
    signatureFileSize.textContent = '';
    
    // Show upload content, hide preview area
    signatureUploadContent.classList.remove('d-none');
    signaturePreviewArea.classList.add('d-none');
});

// ===================================
// Signature Camera Capture Functionality
// ===================================
const signatureCameraBtn = document.getElementById('signatureCameraBtn');
const signatureCameraArea = document.getElementById('signatureCameraArea');
const signatureCameraVideo = document.getElementById('signatureCameraVideo');
const signatureCameraCanvas = document.getElementById('signatureCameraCanvas');
const signatureCaptureBtn = document.getElementById('signatureCaptureBtn');
const closeSignatureCameraBtn = document.getElementById('closeSignatureCameraBtn');
const switchSignatureCameraBtn = document.getElementById('switchSignatureCameraBtn');

// Open signature camera
signatureCameraBtn.addEventListener('click', async () => {
    await startSignatureCamera(currentSignatureFacingMode);
});

// Function to start signature camera with specified facing mode
async function startSignatureCamera(facingMode) {
    try {
        // Stop existing stream if any
        if (signatureCameraStream) {
            signatureCameraStream.getTracks().forEach(track => track.stop());
        }
        
        // Request camera access with specified facing mode
        signatureCameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: facingMode,
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        
        // Set video source
        signatureCameraVideo.srcObject = signatureCameraStream;
        
        // Show camera area, hide upload content
        signatureUploadContent.classList.add('d-none');
        signatureCameraArea.classList.remove('d-none');
        
        const cameraType = facingMode === 'user' ? 'Front' : 'Rear';
        showToast('info', `${cameraType} camera ready! Position your signature and click "Capture Signature"`);
    } catch (error) {
        console.error('Error accessing camera for signature:', error);
        
        let errorMessage = 'Unable to access camera. ';
        if (error.name === 'NotAllowedError') {
            errorMessage += 'Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'No camera found on this device.';
        } else if (error.name === 'OverconstrainedError') {
            errorMessage += 'Requested camera not available. Trying default camera...';
            // Try with default camera
            try {
                signatureCameraStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 640 },
                        height: { ideal: 480 }
                    } 
                });
                signatureCameraVideo.srcObject = signatureCameraStream;
                signatureUploadContent.classList.add('d-none');
                signatureCameraArea.classList.remove('d-none');
                showToast('info', 'Camera ready! Position your signature and click "Capture Signature"');
                return;
            } catch (fallbackError) {
                errorMessage = 'Unable to access any camera.';
            }
        } else {
            errorMessage += 'Please check your camera permissions.';
        }
        
        showToast('error', errorMessage);
    }
}

// Switch signature camera button handler
if (switchSignatureCameraBtn) {
    switchSignatureCameraBtn.addEventListener('click', async () => {
        // Toggle facing mode
        currentSignatureFacingMode = currentSignatureFacingMode === 'user' ? 'environment' : 'user';
        await startSignatureCamera(currentSignatureFacingMode);
    });
}

// Capture signature
signatureCaptureBtn.addEventListener('click', () => {
    // Set canvas size to match video
    signatureCameraCanvas.width = signatureCameraVideo.videoWidth;
    signatureCameraCanvas.height = signatureCameraVideo.videoHeight;
    
    // Draw video frame to canvas
    const context = signatureCameraCanvas.getContext('2d');
    context.drawImage(signatureCameraVideo, 0, 0);
    
    // Convert canvas to blob
    signatureCameraCanvas.toBlob((blob) => {
        // Create file from blob
        const timestamp = new Date().getTime();
        const file = new File([blob], `signature_capture_${timestamp}.jpg`, { 
            type: 'image/jpeg' 
        });
        
        // Validate file size
        const maxSize = 500 * 1024; // 500KB
        if (file.size > maxSize) {
            showToast('warning', 'Captured signature is too large. Compressing...');
            
            // Compress image
            compressImage(signatureCameraCanvas, (compressedBlob) => {
                const compressedFile = new File([compressedBlob], `signature_capture_${timestamp}.jpg`, { 
                    type: 'image/jpeg' 
                });
                
                if (compressedFile.size > maxSize) {
                    showToast('error', 'Unable to compress signature below 500KB. Please try again.');
                    return;
                }
                
                processSignatureCapture(compressedFile);
            });
        } else {
            processSignatureCapture(file);
        }
    }, 'image/jpeg', 0.9);
});

// Process captured signature
function processSignatureCapture(file) {
    // Store file
    selectedSignature = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        signaturePreview.src = e.target.result;
        signatureFileName.textContent = file.name;
        signatureFileSize.textContent = `Size: ${formatFileSize(file.size)}`;
        
        // Hide camera area, show preview
        signatureCameraArea.classList.add('d-none');
        signaturePreviewArea.classList.remove('d-none');
        
        // Stop signature camera
        stopSignatureCamera();
        
        showToast('success', 'Signature captured successfully!');
    };
    reader.readAsDataURL(file);
}

// Close signature camera
closeSignatureCameraBtn.addEventListener('click', () => {
    stopSignatureCamera();
    
    // Show upload content, hide camera area
    signatureCameraArea.classList.add('d-none');
    signatureUploadContent.classList.remove('d-none');
});

// Stop signature camera stream
function stopSignatureCamera() {
    if (signatureCameraStream) {
        signatureCameraStream.getTracks().forEach(track => track.stop());
        signatureCameraStream = null;
        signatureCameraVideo.srcObject = null;
    }
}

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
    
    // Check if signature is uploaded
    if (!selectedSignature) {
        showToast('error', 'Please upload your signature!');
        return;
    }
    
    // Check iPad MAC address if iPad is selected
    const hasIpad = document.querySelector('input[name="has_ipad"]:checked').value;
    if (hasIpad === 'Yes' && !ipadMacAddress.value) {
        showToast('error', 'Please enter iPad MAC address!');
        return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('name', document.getElementById('studentName').value.trim());
    formData.append('year', yearSelect.value);
    formData.append('section', sectionSelect.value);
    formData.append('last_digits', regNumberInput.value);
    formData.append('photo', selectedFile);
    formData.append('signature', selectedSignature);
    formData.append('has_ipad', hasIpad);
    if (hasIpad === 'Yes') {
        formData.append('ipad_mac_address', ipadMacAddress.value);
    }
    
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
        
        // Stop cameras if active
        stopCamera();
        stopSignatureCamera();
        
        // Reset image
        if (selectedFile) {
            removeImageBtn.click();
        }
        
        // Reset signature
        if (selectedSignature) {
            removeSignatureBtn.click();
        }
        
        // Hide camera areas if visible
        if (!cameraArea.classList.contains('d-none')) {
            cameraArea.classList.add('d-none');
            uploadContent.classList.remove('d-none');
        }
        
        if (!signatureCameraArea.classList.contains('d-none')) {
            signatureCameraArea.classList.add('d-none');
            signatureUploadContent.classList.remove('d-none');
        }
        
        // Reset iPad fields
        ipadNo.checked = true;
        macAddressField.classList.add('d-none');
        ipadMacAddress.value = '';
        ipadMacAddress.required = false;
        
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
