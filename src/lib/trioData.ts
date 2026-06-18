// TRIO Connect — Data Layer & Demo Seed

export interface TRIOStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  school: string;
  major: string;
  gpa: number;
  advisor: string;
  status: 'active' | 'at-risk' | 'inactive';
  classification: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  riskLevel: 'low' | 'medium' | 'high';
  missingDocuments: number;
  lastVisit: string | null;
  totalVisits: number;
  upcomingAppointment?: string;
  enrolledDate: string;
  firstGen: boolean;
  pell: boolean;
  notes?: string;
}

export interface CheckIn {
  id: string;
  studentId: string;
  studentName: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  advisor?: string;
  date: string;
}

export interface TRIOAppointment {
  id: string;
  studentId: string;
  studentName: string;
  advisor: string;
  date: string;
  time: string;
  endTime: string;
  type: string;
  status: 'scheduled' | 'completed' | 'no-show' | 'cancelled';
  notes?: string;
}

export interface TRIOEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  attended?: number;
  description: string;
  type: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface TRIOTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  studentName?: string;
  assignedTo: string;
  createdAt: string;
  category: string;
}

export interface TRIOMessage {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'email' | 'sms' | 'push';
  status: 'sent' | 'delivered' | 'read';
  template?: string;
}

export interface TRIODocument {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  fileName: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'missing' | 'expired';
  size?: string;
}

// ── Storage Keys ──────────────────────────────────────────────

const KEYS = {
  students: 'trio-students-v1',
  checkins: 'trio-checkins-v1',
  appointments: 'trio-appointments-v1',
  events: 'trio-events-v1',
  tasks: 'trio-tasks-v1',
  messages: 'trio-messages-v1',
  documents: 'trio-documents-v1',
  seeded: 'trio-seeded-v1',
};

// ── Generic helpers ────────────────────────────────────────────

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; } catch { return []; }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const getStudentsTriο = () => load<TRIOStudent>(KEYS.students);
export const saveStudentsTriο = (d: TRIOStudent[]) => save(KEYS.students, d);
export const getCheckIns = () => load<CheckIn>(KEYS.checkins);
export const saveCheckIns = (d: CheckIn[]) => save(KEYS.checkins, d);
export const getAppointments = () => load<TRIOAppointment>(KEYS.appointments);
export const saveAppointments = (d: TRIOAppointment[]) => save(KEYS.appointments, d);
export const getEvents = () => load<TRIOEvent>(KEYS.events);
export const saveEvents = (d: TRIOEvent[]) => save(KEYS.events, d);
export const getTasks = () => load<TRIOTask>(KEYS.tasks);
export const saveTasks = (d: TRIOTask[]) => save(KEYS.tasks, d);
export const getMessages = () => load<TRIOMessage>(KEYS.messages);
export const saveMessages = (d: TRIOMessage[]) => save(KEYS.messages, d);
export const getDocuments = () => load<TRIODocument>(KEYS.documents);
export const saveDocuments = (d: TRIODocument[]) => save(KEYS.documents, d);

// ── Date helpers ───────────────────────────────────────────────

const TODAY = '2026-06-16';

function daysAgo(n: number): string {
  const d = new Date('2026-06-16');
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysAhead(n: number): string {
  const d = new Date('2026-06-16');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── Demo Seed ─────────────────────────────────────────────────

const DEMO_STUDENTS: Omit<TRIOStudent, 'id'>[] = [
  { name: 'Marcus Johnson', email: 'mjohnson@student.ctstate.edu', phone: '(203) 555-0101', studentId: 'CT-2024-001', school: 'CT State Naugatuck Valley', major: 'Business Administration', gpa: 2.4, advisor: 'Maria Santos', status: 'at-risk', classification: 'Sophomore', riskLevel: 'high', missingDocuments: 2, lastVisit: daysAgo(42), totalVisits: 3, enrolledDate: '2024-09-01', firstGen: true, pell: true, notes: 'Student missed 2 recent appointments. Needs academic coaching.' },
  { name: 'Aaliyah Williams', email: 'awilliams@student.ctstate.edu', phone: '(203) 555-0102', studentId: 'CT-2024-002', school: 'CT State Hartford', major: 'Nursing (RN)', gpa: 3.6, advisor: 'Keisha Brown', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(4), totalVisits: 18, upcomingAppointment: TODAY + ' 9:00 AM', enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Devon Rodriguez', email: 'drodriguez@student.ctstate.edu', phone: '(860) 555-0103', studentId: 'CT-2024-003', school: 'CT State Manchester', major: 'Computer Information Systems', gpa: 3.1, advisor: 'James Wilson', status: 'active', classification: 'Freshman', riskLevel: 'low', missingDocuments: 1, lastVisit: daysAgo(7), totalVisits: 9, enrolledDate: '2025-01-01', firstGen: true, pell: false },
  { name: 'Jasmine Chen', email: 'jchen@student.ctstate.edu', phone: '(203) 555-0104', studentId: 'CT-2024-004', school: 'CT State Norwalk', major: 'Psychology', gpa: 3.8, advisor: 'Maria Santos', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(2), totalVisits: 31, upcomingAppointment: TODAY + ' 11:00 AM', enrolledDate: '2022-09-01', firstGen: false, pell: true },
  { name: 'Tyler Brooks', email: 'tbrooks@student.ctstate.edu', phone: '(860) 555-0105', studentId: 'CT-2024-005', school: 'CT State Naugatuck Valley', major: 'Criminal Justice', gpa: 2.8, advisor: 'Keisha Brown', status: 'active', classification: 'Sophomore', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(14), totalVisits: 7, enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Maya Patel', email: 'mpatel@student.ctstate.edu', phone: '(203) 555-0106', studentId: 'CT-2024-006', school: 'CT State Housatonic', major: 'Accounting', gpa: 3.4, advisor: 'Maria Santos', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(6), totalVisits: 14, enrolledDate: '2023-09-01', firstGen: false, pell: false },
  { name: 'Jordan Scott', email: 'jscott@student.ctstate.edu', phone: '(860) 555-0107', studentId: 'CT-2024-007', school: 'CT State Manchester', major: 'Liberal Arts & Sciences', gpa: 2.1, advisor: 'James Wilson', status: 'at-risk', classification: 'Freshman', riskLevel: 'high', missingDocuments: 3, lastVisit: daysAgo(38), totalVisits: 2, enrolledDate: '2025-09-01', firstGen: true, pell: true, notes: 'No FAFSA on file. Has not responded to outreach.' },
  { name: 'Priya Sharma', email: 'psharma@student.ctstate.edu', phone: '(203) 555-0108', studentId: 'CT-2024-008', school: 'CT State Hartford', major: 'Medical Assistant', gpa: 3.7, advisor: 'Keisha Brown', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(3), totalVisits: 22, upcomingAppointment: TODAY + ' 2:00 PM', enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Alex Martinez', email: 'amartinez@student.ctstate.edu', phone: '(860) 555-0109', studentId: 'CT-2024-009', school: 'CT State Naugatuck Valley', major: 'Electrical Technology', gpa: 2.9, advisor: 'Maria Santos', status: 'active', classification: 'Junior', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(18), totalVisits: 8, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Destiny Parker', email: 'dparker@student.ctstate.edu', phone: '(203) 555-0110', studentId: 'CT-2024-010', school: 'CT State Norwalk', major: 'Human Services', gpa: 3.2, advisor: 'Keisha Brown', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(5), totalVisits: 17, enrolledDate: '2024-09-01', firstGen: true, pell: false },
  { name: 'Kevin Nguyen', email: 'knguyen@student.ctstate.edu', phone: '(860) 555-0111', studentId: 'CT-2024-011', school: 'CT State Hartford', major: 'Computer Information Systems', gpa: 3.9, advisor: 'James Wilson', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(1), totalVisits: 28, enrolledDate: '2022-09-01', firstGen: false, pell: false },
  { name: 'Brianna Davis', email: 'bdavis@student.ctstate.edu', phone: '(203) 555-0112', studentId: 'CT-2024-012', school: 'CT State Naugatuck Valley', major: 'Early Childhood Education', gpa: 3.5, advisor: 'Maria Santos', status: 'active', classification: 'Freshman', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(8), totalVisits: 6, upcomingAppointment: daysAhead(2) + ' 10:00 AM', enrolledDate: '2025-09-01', firstGen: true, pell: true },
  { name: 'Elijah Thompson', email: 'ethompson@student.ctstate.edu', phone: '(860) 555-0113', studentId: 'CT-2024-013', school: 'CT State Manchester', major: 'Criminal Justice', gpa: 2.3, advisor: 'Keisha Brown', status: 'at-risk', classification: 'Sophomore', riskLevel: 'medium', missingDocuments: 2, lastVisit: daysAgo(25), totalVisits: 5, enrolledDate: '2024-09-01', firstGen: true, pell: true, notes: 'Missed 3 appointments. Attendance declining.' },
  { name: 'Sofia Hernandez', email: 'shernandez@student.ctstate.edu', phone: '(203) 555-0114', studentId: 'CT-2024-014', school: 'CT State Housatonic', major: 'Business Administration', gpa: 3.3, advisor: 'James Wilson', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(10), totalVisits: 13, enrolledDate: '2023-09-01', firstGen: false, pell: false },
  { name: 'Brandon Lewis', email: 'blewis@student.ctstate.edu', phone: '(860) 555-0115', studentId: 'CT-2024-015', school: 'CT State Hartford', major: 'Graphic Design', gpa: 3.0, advisor: 'Maria Santos', status: 'active', classification: 'Freshman', riskLevel: 'low', missingDocuments: 1, lastVisit: daysAgo(12), totalVisits: 4, enrolledDate: '2025-09-01', firstGen: true, pell: true },
  { name: 'Amara Wilson', email: 'awilson@student.ctstate.edu', phone: '(203) 555-0116', studentId: 'CT-2024-016', school: 'CT State Naugatuck Valley', major: 'Nursing (RN)', gpa: 3.7, advisor: 'Keisha Brown', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(2), totalVisits: 35, upcomingAppointment: TODAY + ' 3:00 PM', enrolledDate: '2022-09-01', firstGen: true, pell: true },
  { name: 'Caleb Moore', email: 'cmoore@student.ctstate.edu', phone: '(860) 555-0117', studentId: 'CT-2024-017', school: 'CT State Manchester', major: 'Accounting', gpa: 2.6, advisor: 'James Wilson', status: 'active', classification: 'Sophomore', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(20), totalVisits: 6, enrolledDate: '2024-09-01', firstGen: true, pell: false },
  { name: 'Zoe Taylor', email: 'ztaylor@student.ctstate.edu', phone: '(203) 555-0118', studentId: 'CT-2024-018', school: 'CT State Norwalk', major: 'Psychology', gpa: 3.5, advisor: 'Maria Santos', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(4), totalVisits: 19, enrolledDate: '2023-09-01', firstGen: false, pell: true },
  { name: 'Malik Anderson', email: 'manderson@student.ctstate.edu', phone: '(860) 555-0119', studentId: 'CT-2024-019', school: 'CT State Housatonic', major: 'Liberal Arts & Sciences', gpa: 2.0, advisor: 'Keisha Brown', status: 'at-risk', classification: 'Freshman', riskLevel: 'high', missingDocuments: 3, lastVisit: daysAgo(52), totalVisits: 1, enrolledDate: '2025-01-01', firstGen: true, pell: true, notes: 'Critical: No visits in 52 days. Emergency outreach needed.' },
  { name: 'Isabella Jackson', email: 'ijackson@student.ctstate.edu', phone: '(203) 555-0120', studentId: 'CT-2024-020', school: 'CT State Hartford', major: 'Medical Assistant', gpa: 3.4, advisor: 'James Wilson', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(7), totalVisits: 11, enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Rashid Brown', email: 'rbrown@student.ctstate.edu', phone: '(860) 555-0121', studentId: 'CT-2024-021', school: 'CT State Naugatuck Valley', major: 'Electrical Technology', gpa: 2.7, advisor: 'Maria Santos', status: 'active', classification: 'Junior', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(16), totalVisits: 9, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Chloe White', email: 'cwhite@student.ctstate.edu', phone: '(203) 555-0122', studentId: 'CT-2024-022', school: 'CT State Manchester', major: 'Human Services', gpa: 3.6, advisor: 'Keisha Brown', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(3), totalVisits: 26, enrolledDate: '2022-09-01', firstGen: false, pell: false },
  { name: 'DeShawn Harris', email: 'dharris@student.ctstate.edu', phone: '(860) 555-0123', studentId: 'CT-2024-023', school: 'CT State Norwalk', major: 'Business Administration', gpa: 2.5, advisor: 'James Wilson', status: 'at-risk', classification: 'Sophomore', riskLevel: 'medium', missingDocuments: 2, lastVisit: daysAgo(31), totalVisits: 4, enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Emma Garcia', email: 'egarcia@student.ctstate.edu', phone: '(203) 555-0124', studentId: 'CT-2024-024', school: 'CT State Housatonic', major: 'Early Childhood Education', gpa: 3.9, advisor: 'Maria Santos', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(1), totalVisits: 24, upcomingAppointment: TODAY + ' 10:00 AM', enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Jaylen Robinson', email: 'jrobinson@student.ctstate.edu', phone: '(860) 555-0125', studentId: 'CT-2024-025', school: 'CT State Hartford', major: 'Computer Information Systems', gpa: 3.2, advisor: 'Keisha Brown', status: 'active', classification: 'Freshman', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(9), totalVisits: 5, enrolledDate: '2025-09-01', firstGen: true, pell: false },
  { name: 'Nadia Kim', email: 'nkim@student.ctstate.edu', phone: '(203) 555-0126', studentId: 'CT-2024-026', school: 'CT State Naugatuck Valley', major: 'Accounting', gpa: 3.8, advisor: 'James Wilson', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(5), totalVisits: 29, enrolledDate: '2022-09-01', firstGen: false, pell: true },
  { name: 'Tre Mitchell', email: 'tmitchell@student.ctstate.edu', phone: '(860) 555-0127', studentId: 'CT-2024-027', school: 'CT State Manchester', major: 'Criminal Justice', gpa: 2.2, advisor: 'Maria Santos', status: 'at-risk', classification: 'Sophomore', riskLevel: 'high', missingDocuments: 2, lastVisit: daysAgo(44), totalVisits: 2, enrolledDate: '2024-09-01', firstGen: true, pell: true, notes: 'No FAFSA. Missed last 3 appointments. Needs intervention.' },
  { name: 'Olivia Lee', email: 'olee@student.ctstate.edu', phone: '(203) 555-0128', studentId: 'CT-2024-028', school: 'CT State Norwalk', major: 'Nursing (RN)', gpa: 3.5, advisor: 'Keisha Brown', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(6), totalVisits: 15, enrolledDate: '2023-09-01', firstGen: false, pell: false },
  { name: 'Dante Walker', email: 'dwalker@student.ctstate.edu', phone: '(860) 555-0129', studentId: 'CT-2024-029', school: 'CT State Housatonic', major: 'Graphic Design', gpa: 2.8, advisor: 'James Wilson', status: 'active', classification: 'Freshman', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(19), totalVisits: 3, enrolledDate: '2025-09-01', firstGen: true, pell: true },
  { name: 'Serena Hall', email: 'shall@student.ctstate.edu', phone: '(203) 555-0130', studentId: 'CT-2024-030', school: 'CT State Hartford', major: 'Psychology', gpa: 3.6, advisor: 'Maria Santos', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(2), totalVisits: 33, enrolledDate: '2022-09-01', firstGen: true, pell: true },
  { name: 'Cameron Allen', email: 'callen@student.ctstate.edu', phone: '(860) 555-0131', studentId: 'CT-2024-031', school: 'CT State Naugatuck Valley', major: 'Business Administration', gpa: 3.0, advisor: 'Keisha Brown', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(11), totalVisits: 8, enrolledDate: '2024-09-01', firstGen: true, pell: false },
  { name: 'Fatima Young', email: 'fyoung@student.ctstate.edu', phone: '(203) 555-0132', studentId: 'CT-2024-032', school: 'CT State Manchester', major: 'Human Services', gpa: 3.3, advisor: 'James Wilson', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(7), totalVisits: 12, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Andre King', email: 'aking@student.ctstate.edu', phone: '(860) 555-0133', studentId: 'CT-2024-033', school: 'CT State Norwalk', major: 'Electrical Technology', gpa: 2.6, advisor: 'Maria Santos', status: 'active', classification: 'Sophomore', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(22), totalVisits: 6, enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Victoria Wright', email: 'vwright@student.ctstate.edu', phone: '(203) 555-0134', studentId: 'CT-2024-034', school: 'CT State Housatonic', major: 'Accounting', gpa: 3.8, advisor: 'Keisha Brown', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(3), totalVisits: 27, enrolledDate: '2022-09-01', firstGen: false, pell: false },
  { name: 'Darius Turner', email: 'dturner@student.ctstate.edu', phone: '(860) 555-0135', studentId: 'CT-2024-035', school: 'CT State Hartford', major: 'Computer Information Systems', gpa: 2.9, advisor: 'James Wilson', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 1, lastVisit: daysAgo(13), totalVisits: 10, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Alicia Phillips', email: 'aphillips@student.ctstate.edu', phone: '(203) 555-0136', studentId: 'CT-2024-036', school: 'CT State Naugatuck Valley', major: 'Medical Assistant', gpa: 3.4, advisor: 'Maria Santos', status: 'active', classification: 'Freshman', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(5), totalVisits: 7, enrolledDate: '2025-09-01', firstGen: true, pell: true },
  { name: 'Quinton Campbell', email: 'qcampbell@student.ctstate.edu', phone: '(860) 555-0137', studentId: 'CT-2024-037', school: 'CT State Manchester', major: 'Liberal Arts & Sciences', gpa: 2.4, advisor: 'Keisha Brown', status: 'at-risk', classification: 'Sophomore', riskLevel: 'medium', missingDocuments: 2, lastVisit: daysAgo(27), totalVisits: 4, enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Monique Carter', email: 'mcarter@student.ctstate.edu', phone: '(203) 555-0138', studentId: 'CT-2024-038', school: 'CT State Norwalk', major: 'Early Childhood Education', gpa: 3.7, advisor: 'James Wilson', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(4), totalVisits: 16, enrolledDate: '2023-09-01', firstGen: false, pell: true },
  { name: 'Isaiah Evans', email: 'ievans@student.ctstate.edu', phone: '(860) 555-0139', studentId: 'CT-2024-039', school: 'CT State Housatonic', major: 'Criminal Justice', gpa: 3.1, advisor: 'Maria Santos', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(8), totalVisits: 21, enrolledDate: '2022-09-01', firstGen: true, pell: false },
  { name: 'Leila Adams', email: 'ladams@student.ctstate.edu', phone: '(203) 555-0140', studentId: 'CT-2024-040', school: 'CT State Hartford', major: 'Graphic Design', gpa: 3.5, advisor: 'Keisha Brown', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(6), totalVisits: 9, upcomingAppointment: TODAY + ' 1:00 PM', enrolledDate: '2024-09-01', firstGen: true, pell: true },
  { name: 'Terrence Nelson', email: 'tnelson@student.ctstate.edu', phone: '(860) 555-0141', studentId: 'CT-2024-041', school: 'CT State Naugatuck Valley', major: 'Psychology', gpa: 2.8, advisor: 'James Wilson', status: 'active', classification: 'Junior', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(17), totalVisits: 8, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Crystal Rivera', email: 'crivera@student.ctstate.edu', phone: '(203) 555-0142', studentId: 'CT-2024-042', school: 'CT State Manchester', major: 'Accounting', gpa: 3.6, advisor: 'Maria Santos', status: 'active', classification: 'Freshman', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(2), totalVisits: 5, enrolledDate: '2025-09-01', firstGen: true, pell: true },
  { name: 'Deon James', email: 'djames@student.ctstate.edu', phone: '(860) 555-0143', studentId: 'CT-2024-043', school: 'CT State Norwalk', major: 'Business Administration', gpa: 2.3, advisor: 'Keisha Brown', status: 'at-risk', classification: 'Sophomore', riskLevel: 'high', missingDocuments: 3, lastVisit: daysAgo(49), totalVisits: 1, enrolledDate: '2024-09-01', firstGen: true, pell: true, notes: 'No FAFSA. Critical engagement needed.' },
  { name: 'Patricia Sanchez', email: 'psanchez@student.ctstate.edu', phone: '(203) 555-0144', studentId: 'CT-2024-044', school: 'CT State Housatonic', major: 'Nursing (RN)', gpa: 3.8, advisor: 'James Wilson', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(1), totalVisits: 31, enrolledDate: '2022-09-01', firstGen: false, pell: false },
  { name: 'Jamal Thomas', email: 'jthomas@student.ctstate.edu', phone: '(860) 555-0145', studentId: 'CT-2024-045', school: 'CT State Hartford', major: 'Human Services', gpa: 3.0, advisor: 'Maria Santos', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 1, lastVisit: daysAgo(9), totalVisits: 13, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Amira Jackson', email: 'ajackson@student.ctstate.edu', phone: '(203) 555-0146', studentId: 'CT-2024-046', school: 'CT State Naugatuck Valley', major: 'Computer Information Systems', gpa: 3.3, advisor: 'Keisha Brown', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(3), totalVisits: 11, enrolledDate: '2024-09-01', firstGen: true, pell: false },
  { name: 'Rodney Freeman', email: 'rfreeman@student.ctstate.edu', phone: '(860) 555-0147', studentId: 'CT-2024-047', school: 'CT State Manchester', major: 'Electrical Technology', gpa: 2.7, advisor: 'James Wilson', status: 'active', classification: 'Freshman', riskLevel: 'medium', missingDocuments: 1, lastVisit: daysAgo(21), totalVisits: 4, enrolledDate: '2025-09-01', firstGen: true, pell: true },
  { name: 'Tanya Baker', email: 'tbaker@student.ctstate.edu', phone: '(203) 555-0148', studentId: 'CT-2024-048', school: 'CT State Norwalk', major: 'Liberal Arts & Sciences', gpa: 3.4, advisor: 'Maria Santos', status: 'active', classification: 'Senior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(4), totalVisits: 20, enrolledDate: '2022-09-01', firstGen: false, pell: true },
  { name: 'Marcus Coleman', email: 'mcoleman@student.ctstate.edu', phone: '(860) 555-0149', studentId: 'CT-2024-049', school: 'CT State Housatonic', major: 'Medical Assistant', gpa: 2.9, advisor: 'Keisha Brown', status: 'active', classification: 'Junior', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(10), totalVisits: 12, enrolledDate: '2023-09-01', firstGen: true, pell: true },
  { name: 'Simone Washington', email: 'swashington@student.ctstate.edu', phone: '(203) 555-0150', studentId: 'CT-2024-050', school: 'CT State Hartford', major: 'Early Childhood Education', gpa: 3.7, advisor: 'James Wilson', status: 'active', classification: 'Sophomore', riskLevel: 'low', missingDocuments: 0, lastVisit: daysAgo(5), totalVisits: 10, enrolledDate: '2024-09-01', firstGen: true, pell: true },
];

const DEMO_APPOINTMENTS: Omit<TRIOAppointment, 'id'>[] = [
  { studentId: 'CT-2024-002', studentName: 'Aaliyah Williams', advisor: 'Keisha Brown', date: TODAY, time: '9:00 AM', endTime: '9:30 AM', type: 'Academic Advising', status: 'scheduled', notes: 'FAFSA renewal check-in' },
  { studentId: 'CT-2024-024', studentName: 'Emma Garcia', advisor: 'Maria Santos', date: TODAY, time: '10:00 AM', endTime: '10:45 AM', type: 'Transfer Planning', status: 'completed' },
  { studentId: 'CT-2024-004', studentName: 'Jasmine Chen', advisor: 'Maria Santos', date: TODAY, time: '11:00 AM', endTime: '11:30 AM', type: 'Graduation Review', status: 'scheduled' },
  { studentId: 'CT-2024-040', studentName: 'Leila Adams', advisor: 'Keisha Brown', date: TODAY, time: '1:00 PM', endTime: '1:30 PM', type: 'Career Counseling', status: 'scheduled' },
  { studentId: 'CT-2024-008', studentName: 'Priya Sharma', advisor: 'Keisha Brown', date: TODAY, time: '2:00 PM', endTime: '2:30 PM', type: 'Academic Advising', status: 'scheduled' },
  { studentId: 'CT-2024-016', studentName: 'Amara Wilson', advisor: 'Keisha Brown', date: TODAY, time: '3:00 PM', endTime: '3:30 PM', type: 'Financial Aid Review', status: 'scheduled' },
  { studentId: 'CT-2024-001', studentName: 'Marcus Johnson', advisor: 'Maria Santos', date: daysAgo(2), time: '10:00 AM', endTime: '10:30 AM', type: 'Academic Advising', status: 'no-show' },
  { studentId: 'CT-2024-007', studentName: 'Jordan Scott', advisor: 'James Wilson', date: daysAgo(3), time: '2:00 PM', endTime: '2:30 PM', type: 'Emergency Advising', status: 'no-show' },
  { studentId: 'CT-2024-011', studentName: 'Kevin Nguyen', advisor: 'James Wilson', date: daysAgo(1), time: '11:00 AM', endTime: '11:30 AM', type: 'Transfer Planning', status: 'completed' },
  { studentId: 'CT-2024-030', studentName: 'Serena Hall', advisor: 'Maria Santos', date: daysAhead(1), time: '9:30 AM', endTime: '10:00 AM', type: 'Graduation Review', status: 'scheduled' },
];

const DEMO_EVENTS: Omit<TRIOEvent, 'id'>[] = [
  { title: 'Financial Literacy Workshop', date: TODAY, time: '4:00 PM', location: 'Room 201, Building A', capacity: 40, registered: 32, description: 'Learn essential money management skills, budgeting, and credit building.', type: 'Workshop', status: 'upcoming' },
  { title: 'Transfer Planning Info Session', date: TODAY, time: '5:30 PM', location: 'Cafeteria B', capacity: 60, registered: 28, description: 'Information on transferring to 4-year institutions. Guest speakers from UConn and CCSU.', type: 'Info Session', status: 'upcoming' },
  { title: 'FAFSA Completion Workshop', date: daysAhead(3), time: '3:00 PM', location: 'Computer Lab 104', capacity: 20, registered: 18, description: 'Hands-on FAFSA completion assistance. Bring your tax documents.', type: 'Workshop', status: 'upcoming' },
  { title: 'Resume Writing & Career Fair Prep', date: daysAhead(7), time: '2:00 PM', location: 'Conference Room C', capacity: 30, registered: 22, description: 'Learn to craft a winning resume. Mock interviews included.', type: 'Workshop', status: 'upcoming' },
  { title: 'Mental Health & Wellness Panel', date: daysAhead(10), time: '12:00 PM', location: 'Student Lounge', capacity: 50, registered: 15, description: 'Stress management, mental health resources, and peer support discussion.', type: 'Panel', status: 'upcoming' },
  { title: 'Scholarship Application Bootcamp', date: daysAhead(14), time: '1:00 PM', location: 'Room 305', capacity: 25, registered: 19, description: 'One-on-one help completing scholarship applications. $500–$5,000 opportunities.', type: 'Workshop', status: 'upcoming' },
  { title: 'College Visit — University of Connecticut', date: daysAhead(21), time: '8:00 AM', location: 'Departs from Main Campus', capacity: 35, registered: 31, description: 'Campus tour and admissions meeting at UConn. Lunch provided.', type: 'Field Trip', status: 'upcoming' },
  { title: 'FAFSA Night', date: daysAgo(7), time: '5:00 PM', location: 'Computer Lab 104', capacity: 20, registered: 17, attended: 14, description: 'FAFSA completion event.', type: 'Workshop', status: 'completed' },
];

const DEMO_TASKS: Omit<TRIOTask, 'id'>[] = [
  { title: 'Call Marcus Johnson', description: 'Follow up on missed appointment and FAFSA status', dueDate: TODAY, priority: 'high', status: 'pending', studentName: 'Marcus Johnson', assignedTo: 'Maria Santos', createdAt: daysAgo(1), category: 'Follow Up' },
  { title: 'Review Aaliyah Williams FAFSA', description: 'FAFSA renewal needs advisor signature by Friday', dueDate: daysAhead(1), priority: 'high', status: 'in-progress', studentName: 'Aaliyah Williams', assignedTo: 'Keisha Brown', createdAt: daysAgo(2), category: 'Financial Aid' },
  { title: 'Send FAFSA reminders to 18 students', description: '18 students missing FAFSA — deadline in 30 days', dueDate: TODAY, priority: 'high', status: 'pending', assignedTo: 'Maria Santos', createdAt: daysAgo(1), category: 'Communications' },
  { title: 'Prepare Financial Literacy Workshop materials', description: 'Print handouts, set up room 201, confirm projector', dueDate: TODAY, priority: 'medium', status: 'in-progress', assignedTo: 'James Wilson', createdAt: daysAgo(3), category: 'Events' },
  { title: 'Outreach — Jordan Scott', description: 'Student has not visited in 38 days. Critical intervention needed.', dueDate: TODAY, priority: 'high', status: 'pending', studentName: 'Jordan Scott', assignedTo: 'James Wilson', createdAt: daysAgo(1), category: 'At Risk' },
  { title: 'Quarterly attendance report', description: 'Generate Q2 attendance report for grant compliance', dueDate: daysAhead(3), priority: 'medium', status: 'pending', assignedTo: 'Maria Santos', createdAt: daysAgo(2), category: 'Reporting' },
  { title: 'Update Malik Anderson file', description: 'Missing documents: FAFSA, Enrollment Verification, Emergency Contact', dueDate: daysAhead(2), priority: 'high', status: 'pending', studentName: 'Malik Anderson', assignedTo: 'Keisha Brown', createdAt: daysAgo(1), category: 'Documents' },
  { title: 'Schedule Elijah Thompson intervention', description: 'GPA declining, attendance dropping. Schedule academic coaching.', dueDate: daysAhead(1), priority: 'medium', status: 'pending', studentName: 'Elijah Thompson', assignedTo: 'Keisha Brown', createdAt: daysAgo(2), category: 'At Risk' },
  { title: 'Book UConn campus visit bus', description: 'Reserve transportation for 35-student campus visit on June 37', dueDate: daysAhead(5), priority: 'medium', status: 'pending', assignedTo: 'James Wilson', createdAt: daysAgo(4), category: 'Events' },
  { title: 'Complete APR data entry', description: 'Annual Performance Report data due to DOE', dueDate: daysAhead(14), priority: 'high', status: 'pending', assignedTo: 'Maria Santos', createdAt: daysAgo(7), category: 'Reporting' },
  { title: 'Review Devon Rodriguez transfer application', description: 'Transfer app to UConn — needs advisor recommendation letter', dueDate: daysAhead(4), priority: 'medium', status: 'in-progress', studentName: 'Devon Rodriguez', assignedTo: 'James Wilson', createdAt: daysAgo(3), category: 'Transfer' },
  { title: 'Send scholarship alerts — 8 students', description: '8 students qualify for Pell + institutional scholarships', dueDate: daysAhead(2), priority: 'medium', status: 'pending', assignedTo: 'Keisha Brown', createdAt: daysAgo(1), category: 'Scholarships' },
];

// Demo check-ins for today
const DEMO_CHECKINS_TODAY: Omit<CheckIn, 'id'>[] = [
  { studentId: 'CT-2024-002', studentName: 'Aaliyah Williams', purpose: 'Appointment', checkInTime: '8:52 AM', checkOutTime: '9:35 AM', advisor: 'Keisha Brown', date: TODAY },
  { studentId: 'CT-2024-024', studentName: 'Emma Garcia', purpose: 'Appointment', checkInTime: '9:48 AM', checkOutTime: '10:50 AM', advisor: 'Maria Santos', date: TODAY },
  { studentId: 'CT-2024-011', studentName: 'Kevin Nguyen', purpose: 'Computer Lab', checkInTime: '9:15 AM', date: TODAY },
  { studentId: 'CT-2024-030', studentName: 'Serena Hall', purpose: 'Study Time', checkInTime: '9:22 AM', date: TODAY },
  { studentId: 'CT-2024-022', studentName: 'Chloe White', purpose: 'Walk-In Visit', checkInTime: '9:55 AM', checkOutTime: '10:20 AM', advisor: 'Keisha Brown', date: TODAY },
  { studentId: 'CT-2024-044', studentName: 'Patricia Sanchez', purpose: 'Study Time', checkInTime: '10:10 AM', date: TODAY },
  { studentId: 'CT-2024-036', studentName: 'Alicia Phillips', purpose: 'Tutoring', checkInTime: '10:18 AM', date: TODAY },
  { studentId: 'CT-2024-026', studentName: 'Nadia Kim', purpose: 'Document Help', checkInTime: '10:30 AM', checkOutTime: '10:55 AM', date: TODAY },
  { studentId: 'CT-2024-005', studentName: 'Tyler Brooks', purpose: 'Walk-In Visit', checkInTime: '10:44 AM', advisor: 'Keisha Brown', date: TODAY },
  { studentId: 'CT-2024-046', studentName: 'Amira Jackson', purpose: 'Computer Lab', checkInTime: '11:01 AM', date: TODAY },
  { studentId: 'CT-2024-018', studentName: 'Zoe Taylor', purpose: 'Study Time', checkInTime: '11:08 AM', date: TODAY },
  { studentId: 'CT-2024-038', studentName: 'Monique Carter', purpose: 'General Visit', checkInTime: '11:22 AM', date: TODAY },
  { studentId: 'CT-2024-004', studentName: 'Jasmine Chen', purpose: 'Appointment', checkInTime: '10:55 AM', checkOutTime: '11:35 AM', advisor: 'Maria Santos', date: TODAY },
  { studentId: 'CT-2024-034', studentName: 'Victoria Wright', purpose: 'Study Time', checkInTime: '11:40 AM', date: TODAY },
  { studentId: 'CT-2024-042', studentName: 'Crystal Rivera', purpose: 'Tutoring', checkInTime: '11:52 AM', date: TODAY },
  { studentId: 'CT-2024-050', studentName: 'Simone Washington', purpose: 'Computer Lab', checkInTime: '12:05 PM', date: TODAY },
  { studentId: 'CT-2024-025', studentName: 'Jaylen Robinson', purpose: 'Walk-In Visit', checkInTime: '12:18 PM', advisor: 'James Wilson', date: TODAY },
  { studentId: 'CT-2024-039', studentName: 'Isaiah Evans', purpose: 'General Visit', checkInTime: '12:31 PM', date: TODAY },
  { studentId: 'CT-2024-010', studentName: 'Destiny Parker', purpose: 'Study Time', checkInTime: '12:45 PM', date: TODAY },
  { studentId: 'CT-2024-049', studentName: 'Marcus Coleman', purpose: 'Computer Lab', checkInTime: '1:02 PM', date: TODAY },
  { studentId: 'CT-2024-040', studentName: 'Leila Adams', purpose: 'Appointment', checkInTime: '12:55 PM', advisor: 'Keisha Brown', date: TODAY },
  { studentId: 'CT-2024-031', studentName: 'Cameron Allen', purpose: 'Walk-In Visit', checkInTime: '1:14 PM', date: TODAY },
  { studentId: 'CT-2024-008', studentName: 'Priya Sharma', purpose: 'Appointment', checkInTime: '1:55 PM', advisor: 'Keisha Brown', date: TODAY },
  { studentId: 'CT-2024-048', studentName: 'Tanya Baker', purpose: 'Study Time', checkInTime: '2:20 PM', date: TODAY },
];

function uid() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function seedDemoData() {
  if (localStorage.getItem(KEYS.seeded)) return;

  const students: TRIOStudent[] = DEMO_STUDENTS.map((s) => ({ ...s, id: uid() }));
  save(KEYS.students, students);

  const appointments: TRIOAppointment[] = DEMO_APPOINTMENTS.map((a) => ({ ...a, id: uid() }));
  save(KEYS.appointments, appointments);

  const events: TRIOEvent[] = DEMO_EVENTS.map((e) => ({ ...e, id: uid() }));
  save(KEYS.events, events);

  const tasks: TRIOTask[] = DEMO_TASKS.map((t) => ({ ...t, id: uid() }));
  save(KEYS.tasks, tasks);

  const checkins: CheckIn[] = DEMO_CHECKINS_TODAY.map((c) => ({ ...c, id: uid() }));
  save(KEYS.checkins, checkins);

  const documents: TRIODocument[] = [
    { id: uid(), studentId: 'CT-2024-002', studentName: 'Aaliyah Williams', type: 'FAFSA', fileName: 'FAFSA_2026_Williams.pdf', uploadDate: daysAgo(30), status: 'verified', size: '1.2 MB' },
    { id: uid(), studentId: 'CT-2024-004', studentName: 'Jasmine Chen', type: 'Transcript', fileName: 'Transcript_Fall2025_Chen.pdf', uploadDate: daysAgo(14), status: 'verified', size: '0.8 MB' },
    { id: uid(), studentId: 'CT-2024-016', studentName: 'Amara Wilson', type: 'FAFSA', fileName: 'FAFSA_2026_Wilson.pdf', uploadDate: daysAgo(45), status: 'expired', size: '1.1 MB' },
    { id: uid(), studentId: 'CT-2024-001', studentName: 'Marcus Johnson', type: 'FAFSA', fileName: 'FAFSA_required.pdf', uploadDate: '', status: 'missing' },
    { id: uid(), studentId: 'CT-2024-007', studentName: 'Jordan Scott', type: 'Enrollment Verification', fileName: 'enrollment_verification.pdf', uploadDate: '', status: 'missing' },
    { id: uid(), studentId: 'CT-2024-011', studentName: 'Kevin Nguyen', type: 'Transfer Agreement', fileName: 'Transfer_Artic_UConn_Nguyen.pdf', uploadDate: daysAgo(7), status: 'verified', size: '2.1 MB' },
  ];
  save(KEYS.documents, documents);

  localStorage.setItem(KEYS.seeded, '1');
}

export const TODAY_DATE = TODAY;
export { daysAhead, daysAgo };
