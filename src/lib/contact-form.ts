export const CONTACT_LEVELS = [
  "Beginner (Prarambhika)",
  "Intermediate (Madhyama)",
  "Advanced (Praveena)",
  "Semi-Classical",
  "Not sure yet",
] as const;

export type ContactLevel = (typeof CONTACT_LEVELS)[number];

export type ContactFormInput = {
  name: string;
  age: string;
  phone: string;
  email: string;
  level: string;
  guardian: string;
  aspirations: string;
  trap: string;
  startedAt: string;
  recaptchaToken: string;
};

export type ContactFormErrors = Partial<{
  name: string;
  age: string;
  contact: string;
  level: string;
  guardian: string;
  aspirations: string;
  trap: string;
  startedAt: string;
  recaptchaToken: string;
}>;

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizePhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits.slice(0, 10);
}

export function formatPhoneDisplay(digits: string) {
  const normalized = normalizePhoneDigits(digits);
  const area = normalized.slice(0, 3);
  const mid = normalized.slice(3, 6);
  const last = normalized.slice(6, 10);
  if (normalized.length > 6) return `(${area}) ${mid}-${last}`;
  if (normalized.length > 3) return `(${area}) ${mid}`;
  if (normalized.length > 0) return `(${area}`;
  return "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedLevel(level: string): level is ContactLevel {
  return (CONTACT_LEVELS as readonly string[]).includes(level);
}

export function validateContactForm(input: Partial<ContactFormInput>) {
  const name = normalizeText(input.name ?? "");
  const age = normalizeText(input.age ?? "");
  const phone = normalizePhoneDigits(input.phone ?? "");
  const email = normalizeText(input.email ?? "");
  const level = normalizeText(input.level ?? "");
  const guardian = normalizeText(input.guardian ?? "");
  const aspirations = normalizeText(input.aspirations ?? "");
  const trap = normalizeText(input.trap ?? "");
  const startedAt = normalizeText(input.startedAt ?? "");
  const recaptchaToken = normalizeText(input.recaptchaToken ?? "");

  const errors: ContactFormErrors = {};

  if (!name) {
    errors.name = "Please enter the student's name.";
  } else if (name.length > 120) {
    errors.name = "Student name must be 120 characters or fewer.";
  }

  if (age) {
    const ageNumber = Number(age);
    if (!Number.isInteger(ageNumber) || ageNumber < 3 || ageNumber > 99) {
      errors.age = "Enter a valid age between 3 and 99.";
    }
  }

  if (!phone && !email) {
    errors.contact = "Add a phone number or email so we can reply.";
  } else if (phone && phone.length !== 10) {
    errors.contact = "Enter a valid 10-digit US mobile number.";
  } else if (email && !isValidEmail(email)) {
    errors.contact = "Enter a valid email address.";
  } else if (email.length > 255) {
    errors.contact = "Email must be 255 characters or fewer.";
  }

  if (level && !isAllowedLevel(level)) {
    errors.level = "Select a valid experience level.";
  } else if (level.length > 100) {
    errors.level = "Experience level must be 100 characters or fewer.";
  }

  if (guardian.length > 120) {
    errors.guardian = "Parent/guardian name must be 120 characters or fewer.";
  }

  if (aspirations.length > 3000) {
    errors.aspirations = "Please keep your message under 3000 characters.";
  }

  if (trap) {
    errors.trap = "Submission rejected.";
  }

  if (!recaptchaToken) {
    errors.recaptchaToken = "Please confirm you are not a robot.";
  }

  if (startedAt) {
    const started = Number(startedAt);
    if (Number.isFinite(started) && Date.now() - started < 2500) {
      errors.startedAt = "Submission rejected.";
    }
  }

  return {
    errors,
    values: {
      name,
      age,
      phone,
      email,
      level: level || CONTACT_LEVELS[0],
      guardian,
      aspirations,
      trap,
      startedAt,
      recaptchaToken,
    },
  };
}
