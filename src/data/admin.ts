export type AppStatus = "Submitted" | "Pending" | "Under Review" | "Screening Completed" | "Admitted" | "Rejected";

export type AdminCandidate = {
  id: string;
  name: string;
  jambReg: string;
  programme: string;
  score: number;
  eligible: boolean;
  status: AppStatus;
  date: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  state: string;
  lga: string;
  photo: string;
  docs: number;
  paid: boolean;
  reference: string;
};

const first = ["Oluwaseun", "Chiamaka", "Ibrahim", "Fatima", "Emeka", "Aisha", "Tunde", "Ngozi", "Musa", "Blessing", "Yusuf", "Adaeze", "Kehinde", "Zainab", "Obinna", "Halima", "Segun", "Ifeoma", "Abdullahi", "Temitope", "Chinedu", "Hauwa", "Babatunde", "Amaka"];
const last = ["Johnson", "Okafor", "Bello", "Abubakar", "Nwosu", "Mohammed", "Adeyemi", "Eze", "Garba", "Okon", "Lawal", "Obi"];
const programmes = ["Computer Science", "Accounting", "Business Administration", "Economics", "Mass Communication", "Political Science", "Nursing"];
const states = [["Oyo", "Ibadan North"], ["Lagos", "Ikeja"], ["Kano", "Nassarawa"], ["Enugu", "Nsukka"], ["Kaduna", "Zaria"], ["Anambra", "Awka South"]];
const statuses: AppStatus[] = ["Submitted", "Pending", "Under Review", "Screening Completed", "Admitted", "Submitted", "Pending"];

export const adminCandidates: AdminCandidate[] = Array.from({ length: 24 }, (_, i) => {
  const score = 160 + ((i * 37) % 140);
  const eligible = score >= 200;
  const [state, lga] = states[i % states.length]!;
  const female = i % 2 === 1;
  return {
    id: String(1001 + i),
    name: `${first[i]!} ${last[i % last.length]}`,
    jambReg: String(9876543210 - i * 7319),
    programme: programmes[i % programmes.length]!,
    score,
    eligible,
    status: eligible ? statuses[i % statuses.length]! : i % 2 ? "Rejected" : "Pending",
    date: `${String(1 + (i % 28)).padStart(2, "0")} Sep 2026`,
    email: `${first[i]!.toLowerCase()}.${last[i % last.length]!.toLowerCase()}@example.com`,
    phone: `080${String(31234567 + i * 1111).slice(0, 8)}`,
    gender: female ? "Female" : "Male",
    dob: `${String(1 + (i % 27)).padStart(2, "0")}/0${1 + (i % 9)}/2007`,
    state,
    lga,
    photo: `https://randomuser.me/api/portraits/${female ? "women" : "men"}/${10 + i}.jpg`,
    docs: eligible ? 3 + (i % 3) : 2,
    paid: eligible,
    reference: eligible ? `POSTUTME-2026-${String(1245 + i).padStart(6, "0")}` : "—",
  };
});

export const allStatuses: AppStatus[] = ["Submitted", "Pending", "Under Review", "Screening Completed", "Admitted", "Rejected"];
