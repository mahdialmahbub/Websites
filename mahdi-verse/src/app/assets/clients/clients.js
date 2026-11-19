/* ============================================================
   CLIENT DATA STRUCTURE (notun client add korar template)
   ------------------------------------------------------------
   Legend:
   [req]  = lagbei
   [opt]  = thakle dao, na thakle bad dao

   {
     id: "c1",                  // [req] unique id. Project er client.id er sathe hubohu mile jete hobe (niche dekho)
     slug: "client-name-country", // [req] URL e use hoy. lowercase, space → "-", special char (é, ., &) dibe na
                                  //       jemon "lucas-fernandez-spain" (Fernández → fernandez)
     name: "Client Name",       // [req] card + page e dekhabe
     country: "Country Name",   // [req] full nam, jemon "United Arab Emirates"
     image: "/Client.jpg",      // [req] avatar
                                //   - local: public folder e rakho, path "/" diye shuru (public/Client.jpg → "/Client.jpg")
                                //   - remote: https://... (next.config e remotePatterns allow korte hobe,
                                //     jemon randomuser.me / res.cloudinary.com)
     shortIntro: "One line",    // [req] client ke chena jay emon 1 line. client ke, ki chaichilo
                                //       (card e dekhabe, tai 80-100 character er moddhe rakho)
     rating: 4.8,               // [req] number, 0 - 5 (decimal ok, string na)
     mood: "Delighted",         // [req] 1 ta word, client er feeling. jemon Satisfied, Happy, Impressed, Thrilled
   }

   ------------------------------------------------------------
   PROJECT er sathe link kivabe hoy
   ------------------------------------------------------------
   Client er moddhe project list thake na. Link hoy project data theke:

     // projects.js
     client: { id: "c1", name: "...", image: ..., position: "...", feedback: [...] }

   getClientProjects(clientId, allProjects) shob project filter kore
   jar project.client.id === clientId. Mane:
   - Ekta client er 2 ta project hole duita project e same client.id dao.
   - id mile na gele oi client er project list khali dekhabe.
   - Self project hole alada id dao (jemon "c11", name: "Self-Initiated Project"),
     clientsData te entry dite hobe na.

   NOTES:
   - Notun client add korle id age check koro (c1, c2 ... last id + 1), duplicate id dile key warning ashbe.
   - Slug bodle felle purono URL / bookmark kaj korbe na.
   - Image remote hole next.config e domain allow na korle runtime error dey.
   - rating er shathe feedback er rating (project.client.feedback[].rating) alada jinish,
     duita mile thakar dorkar nai, tobe mile thakle bhalo dekhay.
   ============================================================ */
   

const clientsData = [
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