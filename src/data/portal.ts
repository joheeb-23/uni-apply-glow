export const university = {
  name: "Northbridge University",
  short: "N",
  tagline: "Post-UTME Portal · 2025/2026",
  blurb:
    "Shaping tomorrow's leaders through excellence in teaching, research and service since 1978.",
  address: "12 Rivers Avenue, Northbridge Campus, Lagos, Nigeria",
  phone: "+234 801 234 5678",
  email: "admissions@northbridge.edu.ng",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Verify", href: "/verify" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Programmes", href: "/#programmes" },
  { label: "Contact", href: "/#contact" },
];

export const keyDates = [
  { label: "Application Opens", value: "Nov 04, 2025", note: "9:00 AM WAT" },
  { label: "Application Closes", value: "Dec 15, 2025", note: "6:00 PM WAT" },
  { label: "Screening Date", value: "Jan 10, 2026", note: "Campus & online" },
  { label: "Application Fee", value: "₦10,000", note: "Pay online" },
];

export const processSteps = [
  { title: "Verify JAMB Information", note: "Confirm your candidate number." },
  { title: "Check Eligibility", note: "Meet the cut-off for your course." },
  { title: "Make Payment", note: "Pay the screening fee securely." },
  { title: "Complete Application", note: "Fill in your personal details." },
  { title: "Upload Documents", note: "Passport, WAEC & JAMB slip." },
  { title: "Submit Application", note: "Review and confirm to submit." },
  { title: "Print Screening Slip", note: "Download for your screening day." },
  { title: "Check Admission Status", note: "Track your result online." },
];

export type Programme = {
  name: string;
  faculty: string;
  cutOff: number;
  duration: string;
  highlight?: boolean;
};

export const programmes: Programme[] = [
  { name: "Computer Science", faculty: "Faculty of Computing", cutOff: 200, duration: "4 years" },
  { name: "Accounting", faculty: "Faculty of Management", cutOff: 190, duration: "4 years" },
  {
    name: "Business Administration",
    faculty: "Faculty of Management",
    cutOff: 180,
    duration: "4 years",
  },
  { name: "Economics", faculty: "Faculty of Social Sciences", cutOff: 185, duration: "4 years" },
  { name: "Mass Communication", faculty: "Faculty of Arts", cutOff: 195, duration: "4 years" },
  {
    name: "Political Science",
    faculty: "Faculty of Social Sciences",
    cutOff: 180,
    duration: "4 years",
  },
  {
    name: "Nursing",
    faculty: "Faculty of Health Sciences",
    cutOff: 220,
    duration: "5 years",
    highlight: true,
  },
];

export const mockStatus = {
  candidate: "Ola Adewale",
  programme: "Computer Science",
  decision: "Admission — Offered",
  badge: "Accepted",
};
