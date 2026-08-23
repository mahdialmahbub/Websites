/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import SwitchBTN from "../components/SwitchBTN";
import ClientCard from "../components/clients/ClientCard";
import ClientInfoSection from "../components/clients/ClientInfoSection";
import clientsData, {
  getClientProjects,
} from "../../../public/clients/clients";
import projectsData from "../../../public/projects/projects";
import ClientCardSkeleton from "../components/clients/ClientCardSkeleton";

// category text compare korar jonno normalize helper (slash/space ignore kore)
const normalize = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const categories = [
  { label: "All", icon: "fi fi-rr-browser" },
  { label: "UI UX Design", icon: "fi fi-rr-browser" },
  { label: "Web Development", icon: "fi fi-rr-browser" },
];

const SKELETON_DELAY = 700;

const page = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedClientId, setSelectedClientId] = useState(null); // shuru te kono client select thakbe na
  const [loading, setLoading] = useState(true);
  const detailsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), SKELETON_DELAY);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  // ekjon client "match" kore jodi tar kono ekta project-er category active filter-er shathe mile
  const filteredClients = useMemo(() => {
    if (activeCategory === "All") return clientsData;

    return clientsData.filter((client) => {
      const clientProjects = getClientProjects(client.id, projectsData);
      return clientProjects.some(
        (project) => normalize(project.category) === normalize(activeCategory),
      );
    });
  }, [activeCategory]);

  const selectedClient =
    filteredClients.find((c) => c.id === selectedClientId) || null;

  const handleCategoryChange = (label) => {
    setActiveCategory(label);
    setSelectedClientId(null); // notun filter e purono selection reset hoye jabe
  };

  // client select + scroll — dutai ekshathe handle kora hocche
  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId);

    setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const skeletonCount = Math.min(filteredClients.length || 3, 6);

  return (
    <section className="min-w-full space-y-space-7 ">
      <div className=" flex flex-col ">
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
              <SwitchBTN
                key={cat.label}
                icon={cat.icon}
                text={cat.label}
                isActive={activeCategory === cat.label}
                onClick={() => handleCategoryChange(cat.label)}
              />
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex gap-space-6">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <ClientCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="flex gap-space-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                isSelected={selectedClient?.id === client.id}
                onSelect={() => handleSelectClient(client.id)}
              />
            ))}
          </div>
        ) : (
          <p className="font-medium text-size-base text-placeholder_2 py-space-6">
            No clients found in this category.
          </p>
        )}
      </div>

      <div className="w-full h-0.5 rounded-full opacity-20 bg-placeholder"></div>

      <div ref={detailsRef}>
        {selectedClient ? (
          <ClientInfoSection
            client={selectedClient}
            allProjects={projectsData}
          />
        ) : (
          <div className="bg-secondary-50 dark:bgba rounded-2xl min-h-70 flex items-center justify-center dark:bg-background">
            <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder/80">
              Select a client to see details
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default page;
