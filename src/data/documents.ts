export type RequiredDocument = {
  key: string;
  name: string;
  required: boolean;
  hint: string;
};

export const requiredDocuments: RequiredDocument[] = [
  { key: "passport", name: "Passport Photograph", required: true, hint: "Recent passport photo, JPG/PNG, white background" },
  { key: "olevel", name: "O'Level Result", required: true, hint: "WAEC / NECO result, PDF or JPG" },
  { key: "jamb", name: "JAMB Result", required: true, hint: "Original JAMB result slip, PDF" },
  { key: "birth", name: "Birth Certificate", required: true, hint: "NPC birth certificate or age declaration" },
  { key: "nin", name: "NIN Slip", required: true, hint: "National Identification Number slip" },
  { key: "other", name: "Other Required Documents", required: false, hint: "Any additional supporting document" },
];
