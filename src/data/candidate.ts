export type Candidate = {
  photo: string;
  fullName: string;
  jambReg: string;
  jambScore: number;
  email: string;
  phone: string;
  programme: string;
  institution: string;
  oLevel: { subject: string; grade: string }[];
  stateOfOrigin: string;
  localGovernment: string;
  examinationYear: string;
  requiredScore: number;
  eligible: boolean;
};

export const examinationYears = ["2024", "2023", "2022", "2021", "2020"];

export const mockCandidate: Candidate = {
  photo:
    "https://images.unsplash.com/photo-1633332755192-727a05cfa1cd?w=400&h=400&fit=crop&crop=faces",
  fullName: "Oluwaseun Adewale Johnson",
  jambReg: "98765432100",
  jambScore: 214,
  email: "oluwaseun.johnson@example.com",
  phone: "+234 803 555 0142",
  programme: "Computer Science",
  institution: "Northbridge University",
  oLevel: [
    { subject: "Mathematics", grade: "A1" },
    { subject: "English Language", grade: "B3" },
    { subject: "Physics", grade: "B2" },
    { subject: "Chemistry", grade: "C4" },
    { subject: "Further Mathematics", grade: "B3" },
    { subject: "Civic Education", grade: "B2" },
  ],
  stateOfOrigin: "Ogun State",
  localGovernment: "Abeokuta South",
  examinationYear: "2024",
  requiredScore: 200,
  eligible: true,
};

export const applicationSteps = [
  { key: "verification", label: "Verification" },
  { key: "eligibility", label: "Eligibility" },
  { key: "payment", label: "Payment" },
  { key: "application", label: "Application" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review" },
  { key: "submission", label: "Submission" },
] as const;

export type StepKey = (typeof applicationSteps)[number]["key"];
