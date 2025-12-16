export interface MediumPost {
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  isExternal?: boolean;
}

export const mediumPosts: MediumPost[] = [
  {
    title: "journey to google deepmind (gsoc 2025)",
    url: "https://medium.com/@heilcheng2-c/how-i-landed-a-google-deepmind-project-in-google-summer-of-code-2025-a-step-by-step-guide-ccb2dee66769",
    publishedAt: "2025-05-10",
    summary: "sharing my experience and strategies for securing a google deepmind project in google summer of code 2025",
    tags: ["Google Summer of Code", "DeepMind", "Career", "Guide"],
    isExternal: true
  },
  {
    title: "complete analysis and evidence: the controversy of hong kong elite secondary students' medisafe app invention (chinese)",
    url: "https://medium.com/@heilcheng2-c/完整分析及證據-香港名校中學生發明-medisafe-應用程式之爭議-43c18f1d8c1b",
    publishedAt: "2025-06-23",
    summary: "analysis with evidence regarding the medisafe controversy, the biggest education scandal in hong kong in recent years",
    tags: ["Hong Kong", "Education", "Technology", "Analysis"],
    isExternal: true
  }
];

export function getMediumPosts(): MediumPost[] {
  return mediumPosts;
} 