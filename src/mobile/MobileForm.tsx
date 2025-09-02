/**
 * Mobile-Optimized Form Component
 * Responsive form design with mobile-friendly inputs and validation
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, EyeOff, Check, AlertCircle, Camera, 
  MapPin, Upload, Mic, MicOff
} from 'lucide-react';

export interface MobileFormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  accept?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  helpText?: string;
}

export interface MobileFormProps {
  fields: MobileFormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
  enableVoiceInput?: boolean;
  enableGeolocation?: boolean;
  enableCamera?: boolean;
}

const MobileForm: React.FC<MobileFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  className = '',
  enableVoiceInput = false,
  enableGeolocation = false,
  enableCamera = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isListening, setIsListening] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const recognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition if supported and enabled
  useEffect(() => {
    if (enableVoiceInput && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';
    }
  }, [enableVoiceInput]);

  // Handle form data changes
  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle field blur (for validation)
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
    setFocusedField(null);
  };

  // Handle field focus
  const handleFocus = (name: string) => {
    setFocusedField(name);
  };

  // Validate individual field
  const validateField = (name: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return;

    const value = formData[name];
    let error = null;

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = `${field.label} is required`;
    }
    
    // Custom validation
    else if (field.validation && value) {
      error = field.validation(value);
    }
    
    // Built-in validations
    else if (value && typeof value === 'string') {
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'tel':
          if (!/^\+?[\d\s\-()]+$/.test(value)) {
            error = 'Please enter a valid phone number';
          }
          break;
        case 'url':
          if (!/^https?:\/\/.+\..+/.test(value)) {
            error = 'Please enter a valid URL';
          }
          break;
      }
    }

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validation && value) {
        const error = field.validation(value);
        if (error) newErrors[field.name] = error;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])));
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Voice input functionality
  const startVoiceInput = (fieldName: string) => {
    if (!recognition.current) return;
    
    setIsListening(prev => ({ ...prev, [fieldName]: true }));
    
    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleInputChange(fieldName, transcript);
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    };
    
    recognition.current.onerror = () => {
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    };
    
    recognition.current.onend = () => {
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    };
    
    recognition.current.start();
  };

  const stopVoiceInput = (fieldName: string) => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  // Geolocation functionality
  const getCurrentLocation = (fieldName: string) => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = `${position.coords.latitude}, ${position.coords.longitude}`;
        handleInputChange(fieldName, location);
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  };

  // Camera functionality
  const openCamera = (fieldName: string) => {
    const input = fileInputRefs.current[fieldName];
    if (input) {
      input.setAttribute('capture', 'environment');
      input.click();
    }
  };

  // Render field based on type
  const renderField = (field: MobileFormField) => {
    const value = formData[field.name] || '';
    const error = touched[field.name] ? errors[field.name] : null;
    const isFocused = focusedField === field.name;
    const IconComponent = field.icon;

    const baseInputClass = `
      w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 bg-white
      ${error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : isFocused 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-300 focus:border-blue-500'
      }
      ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-200'}
      placeholder:text-gray-400
    `;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <textarea
                name={field.name}
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                onFocus={() => handleFocus(field.name)}
                placeholder={field.placeholder}
                rows={field.rows || 4}
                disabled={field.disabled}
                className={`${baseInputClass} resize-none`}
              />
              {enableVoiceInput && (
                <button
                  type="button"
                  onClick={() => isListening[field.name] ? stopVoiceInput(field.name) : startVoiceInput(field.name)}
                  className="absolute right-3 top-3 p-1 text-gray-400 hover:text-blue-600"
                >
                  {isListening[field.name] ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              onFocus={() => handleFocus(field.name)}
              disabled={field.disabled}
              className={baseInputClass}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={!!value}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                onBlur={() => handleBlur(field.name)}
                disabled={field.disabled}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {field.helpText && <p className="text-sm text-gray-500 ml-8">{field.helpText}</p>}
            {error && <p className="text-sm text-red-600 flex items-center gap-1 ml-8"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              <input
                ref={(el) => fileInputRefs.current[field.name] = el}
                type="file"
                name={field.name}
                onChange={(e) => handleInputChange(field.name, e.target.files)}
                onBlur={() => handleBlur(field.name)}
                accept={field.accept}
                multiple={field.multiple}
                disabled={field.disabled}
                className="hidden"
              />
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[field.name]?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  Choose Files
                </button>
                
                {enableCamera && field.accept?.includes('image') && (
                  <button
                    type="button"
                    onClick={() => openCamera(field.name)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {value && value.length > 0 && (
                <div className="text-sm text-gray-600">
                  {Array.from(value as FileList).map((file: File) => file.name).join(', ')}
                </div>
              )}
            </div>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>
        );

      case 'password':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              {IconComponent && (
                <IconComponent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              )}
              <input
                type={showPasswords[field.name] ? 'text' : 'password'}
                name={field.name}
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                onFocus={() => handleFocus(field.name)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                autoComplete={field.autoComplete}
                className={`${baseInputClass} ${IconComponent ? 'pl-10' : ''} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords[field.name] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              {IconComponent && (
                <IconComponent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              )}
              <input
                type={field.type}
                name={field.name}
                value={value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                onFocus={() => handleFocus(field.name)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                min={field.min}
                max={field.max}
                step={field.step}
                autoComplete={field.autoComplete}
                className={`${baseInputClass} ${IconComponent ? 'pl-10' : ''} ${
                  enableVoiceInput || (enableGeolocation && field.type === 'text') ? 'pr-10' : ''
                }`}
              />
              
              {/* Voice input button */}
              {enableVoiceInput && field.type === 'text' && (
                <button
                  type="button"
                  onClick={() => isListening[field.name] ? stopVoiceInput(field.name) : startVoiceInput(field.name)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  {isListening[field.name] ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              
              {/* Geolocation button */}
              {enableGeolocation && field.type === 'text' && field.name.toLowerCase().includes('location') && (
                <button
                  type="button"
                  onClick={() => getCurrentLocation(field.name)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              )}
            </div>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
            {error && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map(renderField)}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            {submitLabel}
          </>
        )}
      </button>
    </form>
  );
};

export default MobileForm;