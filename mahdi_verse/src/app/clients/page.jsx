import Link from "next/link";
import SwitchBTN from "../components/SwitchBTN";
import ClientCard from "../components/clients/ClientCard";
import ClientInfoSection from "../components/clients/ClientInfoSection";
import ScrollToDetails from "../components/ScrollToDetails";
import clientsData, { getClientProjects } from "../assets/clients/clients";
import projectsData from "../assets/projects/projects";
// path ta tomar helper file onujayi thik kore nio
import { VIEW_META, matchesCategory } from "../utils/projectViews";

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
    <section className="min-w-full space-y-space-7">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-space-7">
          <div>
            <h2 className="font-primary text-size-xl font-semibold opacity-0 animate-fade-left">
              All Clients
            </h2>
            <p className="text-placeholder_2 font-medium text-size-base mt-space-2 opacity-0 animate-fade-left [animation-delay:120ms]">
              Here are some of my recent projects. Feel free to explore!
            </p>
          </div>

          <div className="flex items-center gap-space-3 p-space-3 bg-secondary-50 *:w-50 dark:bg-secondary-500/10 rounded-lg opacity-0 animate-fade-right">
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
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <div className="flex items-stretch gap-space-6 overflow-x-auto p-1">
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
        ) : (
          <p className="font-medium text-size-base text-placeholder_2 py-space-6">
            No clients found in this category.
          </p>
        )}
      </div>

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
            <p className=" text-size-base text-placeholder_2 dark:text-placeholder/80">
              Select a client to see details
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
