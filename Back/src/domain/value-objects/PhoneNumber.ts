export class PhoneNumber {
  private readonly value: string;

  constructor(phone: string) {
    const cleaned = this.clean(phone);
    if (!this.isValid(cleaned)) {
      throw new Error(`Invalid phone number format: ${phone}`);
    }
    this.value = cleaned;
  }

  private clean(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private isValid(phone: string): boolean {
    // Validates phone numbers with 7-15 digits (flexible for international)
    return /^\d{7,15}$/.test(phone);
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    // Simple formatting for display
    if (this.value.length === 10) {
      return `(${this.value.slice(0, 3)}) ${this.value.slice(3, 6)}-${this.value.slice(6)}`;
    }
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
