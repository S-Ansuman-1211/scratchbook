// Celebrity-led book launches & events (from ScratchBook portfolio).
// `cover` points to an imported book cover where available; entries without one
// render a styled placeholder tile. Real event photos can be dropped into
// /public/gallery and referenced via `photo` later.

export type Launch = {
  title: string;
  by: string; // who launched / where
  cover?: string;
  tag: "CELEBRITY LAUNCH" | "BOOK LAUNCH" | "BOOK FAIR" | "EVENT";
};

export const LAUNCHES: Launch[] = [
  { title: "Jayamma Panchayati", by: "Launched by Actress & Anchor Suma Kanakala", cover: "/covers/jayamma-panchayati.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "From Idly Seller to Startup Founder", by: "Launched by Actor Nagababu", cover: "/covers/idly-seller-to-startup-founder.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "Nene Rajithe", by: "Launched by Actor Naresh & Director Karuna Kumar", cover: "/covers/nene-rajithe.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "DAA Magazine", by: "Launched by Actress Hebah Patel", tag: "CELEBRITY LAUNCH" },
  { title: "Anubhutiyon ka Sargam", by: "Grand launch at Maharashtra", cover: "/covers/anubhutiyon-ka-sargam.webp", tag: "BOOK LAUNCH" },
  { title: "Geeta Sarla Kabita", by: "Book launch at Doha, Qatar", tag: "BOOK LAUNCH" },
  { title: "RGV Virus", by: "Book launch at Hyderabad", cover: "/covers/rgv-virus.jpeg", tag: "BOOK LAUNCH" },
  { title: "The Last Roar", by: "Book launch at Hyderabad", tag: "BOOK LAUNCH" },
  { title: "Naa Quora Rathalu", by: "Presented to Add. SP Mallikarjun Varma", cover: "/covers/naa-quora-rathalu.jpg", tag: "EVENT" },
];
