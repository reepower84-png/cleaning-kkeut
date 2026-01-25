import fs from "fs";
import path from "path";

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: "대기중" | "연락완료" | "상담완료";
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "inquiries.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getInquiries(): Inquiry[] {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export function addInquiry(inquiry: Omit<Inquiry, "id" | "status" | "createdAt">): Inquiry {
  ensureDataFile();
  const inquiries = getInquiries();
  const newInquiry: Inquiry = {
    ...inquiry,
    id: Date.now().toString(),
    status: "대기중",
    createdAt: new Date().toISOString(),
  };
  inquiries.unshift(newInquiry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2));
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry["status"]): Inquiry | null {
  ensureDataFile();
  const inquiries = getInquiries();
  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return null;
  inquiries[index].status = status;
  fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2));
  return inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  ensureDataFile();
  const inquiries = getInquiries();
  const filtered = inquiries.filter((inq) => inq.id !== id);
  if (filtered.length === inquiries.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
