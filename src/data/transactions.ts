import { adminCandidates } from "@/data/admin";

export type PayType = "Post-UTME Application Fee" | "Acceptance Fee";
export type PayStatus = "Successful" | "Pending" | "Failed";
export type Txn = {
  id: string;
  name: string;
  jambReg: string;
  email: string;
  phone: string;
  programme: string;
  type: PayType;
  amount: number;
  reference: string;
  date: string; // ISO yyyy-mm-dd
  time: string;
  status: PayStatus;
  channel: string;
};

const channels = ["Card", "Bank Transfer", "USSD"];

export const transactions: Txn[] = adminCandidates.flatMap((c, i) => {
  const appStatus: PayStatus = i % 9 === 4 ? "Failed" : i % 7 === 3 ? "Pending" : "Successful";
  const list: Txn[] = [
    {
      id: `A${c.id}`, name: c.name, jambReg: c.jambReg, email: c.email, phone: c.phone, programme: c.programme,
      type: "Post-UTME Application Fee", amount: 5000,
      reference: `POSTUTME-2026-${String(1245 + i).padStart(6, "0")}`,
      date: `2026-09-${String(1 + (i % 28)).padStart(2, "0")}`, time: `${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
      status: appStatus, channel: channels[i % 3]!,
    },
  ];
  if (i % 3 !== 2 && appStatus === "Successful") {
    list.push({
      id: `C${c.id}`, name: c.name, jambReg: c.jambReg, email: c.email, phone: c.phone, programme: c.programme,
      type: "Acceptance Fee", amount: 100000,
      reference: `ACCEPT-2026-${String(504120 + i * 37)}`,
      date: `2026-10-${String(1 + (i % 6)).padStart(2, "0")}`, time: `${String(9 + (i % 8)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
      status: i % 5 === 1 ? "Pending" : i % 11 === 6 ? "Failed" : "Successful", channel: channels[(i + 1) % 3]!,
    });
  }
  return list;
});

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
export const fmtDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
