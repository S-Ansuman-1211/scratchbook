// Celebrity-led book launches & events (from ScratchBook portfolio).
// Real event photos (extracted from the DAA portfolio) live in /public/gallery;
// where no photo is available yet we fall back to the book cover.

export type Launch = {
  title: string;
  by: string; // who launched / where
  cover?: string;
  tag: "CELEBRITY LAUNCH" | "BOOK LAUNCH" | "BOOK FAIR" | "EVENT";
};

export const LAUNCHES: Launch[] = [
  // Real event photographs from the launches
  { title: "Jayamma Panchayati", by: "Launched by Actress & Anchor Suma Kanakala", cover: "/gallery/launch-panchayati.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "D'Artiste Artifex Magazine", by: "Magazine launch on stage with the cast & celebrities", cover: "/gallery/launch-stage.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "Young Era of Film Making", by: "DAA magazine unveiling by the team & authors", cover: "/gallery/launch-crowd.jpg", tag: "EVENT" },
  { title: "Magazine Launch Moments", by: "Behind the scenes at a D'Artiste Artifex launch", cover: "/gallery/launch-van.jpg", tag: "EVENT" },

  // Book launches (illustrated with the book cover)
  { title: "From Idly Seller to Startup Founder", by: "Launched by Actor Nagababu", cover: "/covers/idly-seller-to-startup-founder.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "Nene Rajithe", by: "Launched by Actor Naresh & Director Karuna Kumar", cover: "/covers/nene-rajithe.jpg", tag: "CELEBRITY LAUNCH" },
  { title: "Anubhutiyon ka Sargam", by: "Grand launch at Maharashtra", cover: "/covers/anubhutiyon-ka-sargam.webp", tag: "BOOK LAUNCH" },
  { title: "RGV Virus", by: "Book launch at Hyderabad", cover: "/covers/rgv-virus.jpeg", tag: "BOOK LAUNCH" },
  { title: "Geeta Sarla Kabita", by: "Book launch at Doha, Qatar", cover: "/covers/geeta-sarla-kabita.jpg", tag: "BOOK LAUNCH" },
  { title: "Naa Quora Rathalu", by: "Presented to Add. SP Mallikarjun Varma", cover: "/covers/naa-quora-rathalu.jpg", tag: "EVENT" },
];
