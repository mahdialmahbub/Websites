// clientsData.js
//
// IMPORTANT — this relies on each project in projectsData.js already having a
// nested `client: { id: "c1", ... }` field (which your projectsData.js does).
// So instead of storing a project list directly on the client, we just store
// the client's own info here, and DERIVE their project list on demand by
// filtering projectsData for projects whose `client.id` matches this client's id.
//
// Client -> Project mapping (1:1 for now):
//   c1  Ahmed Al-Farsi   -> p1  FurneiStyle   (design + development)
//   c2  Sarah Mitchell   -> p2  FitPulse      (design only)
//   c3  Rafiq Hasan      -> p3  MediQueue     (development only)
//   c4  Emily Johansson  -> p4  BrewNest      (design + development)
//   c5  Tanvir Ahmed     -> p5  LearnLoop     (design + development)
//   c6  Priya Sharma     -> p6  FinSage       (design only)
//   c7  Lucas Fernández  -> p7  TableTalk     (development only)
//   c8  Aisha Rahman     -> p8  WanderWay     (design only)
//   c9  Daniel Okafor    -> p9  LogiTrack     (development only)
//   c10 Nusrat Jahan     -> p10 KartBD        (design + development)
//
// Ekjon client er ekadhik project thakle: oi project gulor `client.id` e
// ekoi id ("c3" ityadi) boshiye dao — getClientProjects() automatic sob gulo ferot dibe.
//
// Image niyom: c1 er image tomar public folder theke (/clients/clientImages/...).
// Baki client gulor image file ekhono nai, tai randomuser.me (3rd-party API) theke
// placeholder avatar newa hoyeche. Nijer image add korle shudhu `image` replace kore dio.

export const clientsData = [
  {
    id: "c1",
    slug: "ahmed-al-farsi-south-africa",
    name: "Ahmed Al-Farsi",
    country: "South Africa",
    image: "/clients/clientImages/Ahmed_Al_Farsi.jpg", // shown in the glow placeholder if avatarSrc isn't set yet
    shortIntro:
      "Trusted by clients across different industries to design and develop",
    rating: 4.5,
    mood: "Satisfied",
  },
  {
    id: "c2",
    slug: "sarah-mitchell-united-states",
    name: "Sarah Mitchell",
    country: "United States",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    shortIntro:
      "Founder who trusted a clear, user-first design process to launch a mobile fitness app",
    rating: 5.0,
    mood: "Delighted",
  },
  {
    id: "c3",
    slug: "rafiq-hasan-bangladesh",
    name: "Rafiq Hasan",
    country: "Bangladesh",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    shortIntro:
      "Hospital operations lead who replaced paper queues with a live appointment system",
    rating: 4.9,
    mood: "Impressed",
  },
  {
    id: "c4",
    slug: "emily-johansson-sweden",
    name: "Emily Johansson",
    country: "Sweden",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    shortIntro:
      "Marketing director who wanted a premium coffee subscription store, designed and built end to end",
    rating: 4.8,
    mood: "Happy",
  },
  {
    id: "c5",
    slug: "tanvir-ahmed-bangladesh",
    name: "Tanvir Ahmed",
    country: "Bangladesh",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    shortIntro:
      "Academy CEO who launched a full online learning platform with video courses and quizzes",
    rating: 4.7,
    mood: "Satisfied",
  },
  {
    id: "c6",
    slug: "priya-sharma-india",
    name: "Priya Sharma",
    country: "India",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    shortIntro:
      "Product manager who needed a calm, trustworthy design for a personal finance dashboard",
    rating: 4.6,
    mood: "Pleased",
  },
  {
    id: "c7",
    slug: "lucas-fernandez-spain",
    name: "Lucas Fernández",
    country: "Spain",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    shortIntro:
      "Restaurant owner running three branches on one reservation and kitchen system",
    rating: 4.9,
    mood: "Thrilled",
  },
  {
    id: "c8",
    slug: "aisha-rahman-united-arab-emirates",
    name: "Aisha Rahman",
    country: "United Arab Emirates",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    shortIntro:
      "Travel startup co-founder who turned a rough idea into a polished app prototype",
    rating: 4.9,
    mood: "Excited",
  },
  {
    id: "c9",
    slug: "daniel-okafor-nigeria",
    name: "Daniel Okafor",
    country: "Nigeria",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    shortIntro:
      "Logistics CTO who now tracks every driver and delivery on a single live dashboard",
    rating: 4.8,
    mood: "Happy",
  },
  {
    id: "c10",
    slug: "nusrat-jahan-bangladesh",
    name: "Nusrat Jahan",
    country: "Bangladesh",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    shortIntro:
      "Growth lead who scaled a multi-vendor marketplace with local payment methods",
    rating: 4.8,
    mood: "Delighted",
  },
];

/**
 * Returns every project that belongs to a given client.
 * A client can have more than one project, so this always returns an array —
 * even if it's empty (client with no projects yet) or has just one.
 *
 */
export function getClientProjects(clientId, allProjects) {
  return allProjects.filter((project) => project.client?.id === clientId);
}

export default clientsData;