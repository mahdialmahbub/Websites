// clientsData.js
//
// IMPORTANT — this relies on each project in projectsData.js already having a
// nested `client: { id: "c1", ... }` field (which your projectsData.js does).
// So instead of storing a project list directly on the client, we just store
// the client's own info here, and DERIVE their project list on demand by
// filtering projectsData for projects whose `client.id` matches this client's id.
//
// ⚠️ Heads up: in the projectsData.js you pasted, ids are written unquoted,
// e.g. `id: p1` and `client: { id: c1 }`. Those are bare identifiers, not
// strings — unless you have `const p1 = ...` / `const c1 = ...` defined
// somewhere, that will throw "ReferenceError: c1 is not defined" the moment
// the file runs. Quote them as strings: `id: "p1"`, `client: { id: "c1" }`.
// Otherwise the matching below (client.id === project.client.id) can't work.

export const clientsData = [
  {
    id: "c1",
    name: "Ahmed Al-Farsi",
    country: "South Africa" ,
    image: "/clients/clientImages/Ahmed_Al_Farsi.jpg", // shown in the glow placeholder if avatarSrc isn't set yet
    shortIntro: "Trusted by clients across different industries to design and develop",
    rating: 4.5,
    mood: "Satisfied",
  },
  // more clients go here — each just needs a unique `id` that matches
  // the `client.id` used inside the relevant project(s) in projectsData.js
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
