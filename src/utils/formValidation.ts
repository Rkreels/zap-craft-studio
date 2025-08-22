
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class FormValidator {
  private rules: Record<string, ValidationRule> = {};
  private errors: ValidationError[] = [];

  setRule(field: string, rule: ValidationRule): FormValidator {
    this.rules[field] = rule;
    return this;
  }

  validate(data: Record<string, any>): ValidationError[] {
    this.errors = [];

    Object.entries(this.rules).forEach(([field, rule]) => {
      const value = data[field];
      const error = this.validateField(field, value, rule);
      if (error) {
        this.errors.push(error);
      }
    });

    return this.errors;
  }

  private validateField(field: string, value: any, rule: ValidationRule): ValidationError | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return { field, message: `${this.formatFieldName(field)} is required` };
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return { 
          field, 
          message: `${this.formatFieldName(field)} must be at least ${rule.minLength} characters long` 
        };
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return { 
          field, 
          message: `${this.formatFieldName(field)} must be no more than ${rule.maxLength} characters long` 
        };
      }

      // Email validation
      if (rule.email && !this.isValidEmail(value)) {
        return { field, message: `${this.formatFieldName(field)} must be a valid email address` };
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return { field, message: `${this.formatFieldName(field)} format is invalid` };
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return { field, message: customError };
      }
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  getErrorsForField(field: string): string[] {
    return this.errors
      .filter(error => error.field === field)
      .map(error => error.message);
  }
}

// Helper function for quick validation
export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationError[] => {
  const validator = new FormValidator();
  
  Object.entries(rules).forEach(([field, rule]) => {
    validator.setRule(field, rule);
  });
  
  return validator.validate(data);
};

// Common validation patterns
export const ValidationPatterns = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+\..+/,
  slug: /^[a-z0-9-]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  fieldName: /^[a-zA-Z][a-zA-Z0-9_]*$/,
};
