export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const USERS_KEY = "bergara-users";
const SESSION_KEY = "bergara-session";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadSessionEmail(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function saveSessionEmail(email: string): void {
  localStorage.setItem(SESSION_KEY, normalizeEmail(email));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = normalizeEmail(email);
  return readUsers().find((user) => user.email === normalized);
}

export function registerUser(input: SignUpInput): User {
  const email = normalizeEmail(input.email);
  if (findUserByEmail(email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: StoredUser = {
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    password: input.password,
  };

  writeUsers([...readUsers(), user]);
  return { email: user.email, firstName: user.firstName, lastName: user.lastName };
}

export function authenticateUser(
  email: string,
  password: string,
): User | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export function getUserFromSession(): User | null {
  const email = loadSessionEmail();
  if (!email) return null;
  const stored = findUserByEmail(email);
  if (!stored) {
    clearSession();
    return null;
  }
  return {
    email: stored.email,
    firstName: stored.firstName,
    lastName: stored.lastName,
  };
}
