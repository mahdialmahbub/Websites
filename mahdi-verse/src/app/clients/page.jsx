import Link from "next/link";
import SwitchBTN from "../components/SwitchBTN";
import ClientCard from "../components/clients/ClientCard";
import ClientInfoSection from "../components/clients/ClientInfoSection";
import ScrollToDetails from "../components/ScrollToDetails";
import clientsData, { getClientProjects } from "../assets/clients/clients";
import projectsData from "../assets/projects/projects";
// path ta tomar helper file onujayi thik kore nio
import { VIEW_META, matchesCategory } from "../utils/projectViews";
import { buildMetadata } from "../utils/buildMetadata";
import JsonLd from "../components/JsonLd";
import { clientsPageSchema } from "../utils/schema";
import FadeLeft from "../components/motions/FadeLeft";
import FadeRight from "../components/motions/FadeRight";

export const metadata = buildMetadata({
  title: "Clients",
  description:
    "Explore the clients I’ve worked with and the testimonials they’ve shared about my UI/UX design and MERN stack development services.",
  path: "/clients",
});

const ICON = "fi fi-rr-browser";

// VIEW_META theke auto toiri hobe, tai projects page er shathe label kokhono mismatch hobe na
const categories = [
  { label: "All", icon: ICON },
  ...Object.values(VIEW_META).map(({ category }) => ({
    label: category,
    icon: ICON,
  })),
];

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const activeCategory = params?.category || "All";
  const selectedClientSlug = params?.client || null;

  // All e shob client (project na thakleo). Onno category te client er je kono ekta project e oi view thakle dekhabe.
  const filteredClients =
    activeCategory === "All"
      ? clientsData
      : clientsData.filter((client) =>
          getClientProjects(client.id, projectsData).some((project) =>
            matchesCategory(project, activeCategory),
          ),
        );

  const selectedClient =
    filteredClients.find(
      (c) => String(c.slug) === String(selectedClientSlug),
    ) || null;

  return (
    <>
      <JsonLd data={clientsPageSchema()} />
      <section className="min-w-full space-y-space-7">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-space-7 gap-space-4">
            <div>
              <FadeLeft>
                <h1 className="font-primary text-size-xl font-semibold">
                  All Clients
                </h1>
              </FadeLeft>
              <FadeLeft delay={0.1}>
                <p className="text-size-base text-placeholder_2 dark:text-placeholder mt-space-2">
                  The businesses and teams we’ve had the privilege of building
                  with.
                </p>
              </FadeLeft>
            </div>

            <FadeRight className="flex items-center gap-space-3 p-space-3 rounded-lg bg-secondary-50 *:w-40 dark:bg-secondary-500/5">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  href={`?category=${encodeURIComponent(cat.label)}`}
                  scroll={false}
                >
                  <SwitchBTN
                    icon={cat.icon}
                    text={cat.label}
                    isActive={activeCategory === cat.label}
                  />
                </Link>
              ))}
            </FadeRight>
          </div>

          {filteredClients.length > 0 && (
            <div className="flex gap-space-6 overflow-x-auto p-1">
              {filteredClients.map((client) => (
                <Link
                  key={client.id}
                  href={`?category=${encodeURIComponent(activeCategory)}&client=${client.slug}`}
                  scroll={false}
                  className="block shrink-0 *:h-full "
                >
                  <ClientCard
                    client={client}
                    isSelected={selectedClient?.slug === client.slug}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* ) : (
            <p className="font-medium text-size-base text-placeholder_2 py-space-6">
              No clients found in this category.
            </p>
          )} */}
        {filteredClients.length > 0 && (
          <>
            <div className="w-full h-0.5 rounded-full opacity-5 bg-placeholder"></div>
            <div id="client-details">
              {selectedClient ? (
                <>
                  <ScrollToDetails
                    key={selectedClient.id}
                    targetId="client-details"
                  />
                  <ClientInfoSection
                    client={selectedClient}
                    allProjects={projectsData}
                  />
                </>
              ) : (
                <div className="bg-secondary-50 dark:bgba rounded-2xl min-h-70 flex items-center justify-center dark:bg-background">
                  <p className="font-primary text-size-md font-medium tracking-wide text-placeholder_2/80 dark:text-placeholder/80">
                    Select a client to see details
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {filteredClients.length < 0 && (
          <div className="bg-secondary-50 dark:bg-background rounded-2xl min-h-70 flex items-center justify-center flex-col text-placeholder_2 dark:text-placeholder">
            <i className="fi fi-rr-employee-man-alt text-7xl opacity-50"></i>
            <h2 className="font-primary text-size-md font-medium tracking-wide mt-space-4">
              Client projects coming soon
            </h2>
            <p className="mt-1.5 text-center text-placeholder_2/80 dark:text-placeholder/60">
              I’m currently building my client list, and your project could be
              the first one featured here. Let’s work together to create
              something great.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
