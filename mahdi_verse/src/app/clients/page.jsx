/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useMemo } from "react";
import SwitchBTN from "../components/SwitchBTN";
import ClientCard from "../components/clients/ClientCard";
import ClientInfoSection from "../components/clients/ClientInfoSection";
import clientsData, { getClientProjects } from "../../../public/clients/clients";
import projectsData from "../../../public/projects/projects";

// category text compare korar jonno normalize helper (slash/space ignore kore)
const normalize = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const categories = [
  { label: "All", icon: "fi fi-rr-browser" },
  { label: "UI UX Design", icon: "fi fi-rr-browser" },
  { label: "Web Development", icon: "fi fi-rr-browser" },
];

const page = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedClientId, setSelectedClientId] = useState(null);

  // ekjon client "match" kore jodi tar kono ekta project-er category active filter-er shathe mile
  const filteredClients = useMemo(() => {
    if (activeCategory === "All") return clientsData;

    return clientsData.filter((client) => {
      const clientProjects = getClientProjects(client.id, projectsData);
      return clientProjects.some(
        (project) => normalize(project.category) === normalize(activeCategory)
      );
    });
  }, [activeCategory]);

  // selectedClientId filtered list e na thakle (ba kichu select na kora thakle)
  // automatically list-er first client select dekhabe
  const selectedClient =
    filteredClients.find((c) => c.id === selectedClientId) ||
    filteredClients[0] ||
    null;

  const handleCategoryChange = (label) => {
    setActiveCategory(label);
    setSelectedClientId(null); // notun filter e reset — first client auto-select hobe
  };

  return (
    <section className="min-w-full space-y-space-7 ">
      <div className=" flex flex-col ">
        <div className="flex items-center justify-between mb-space-7">
          <div>
            <h2 className="font-primary text-size-xl font-semibold">
              All Clients
            </h2>
            <p className="text-placeholder_2 font-medium text-size-base mt-space-2">
              Here are some of my recent projects. Feel free to explore!
            </p>
          </div>
          <div className="flex items-center gap-space-3 p-space-3 rounded-[8px] bg-secondary-50 *:w-[200px]">
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

        <div className="flex flex-wrap gap-space-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                isSelected={selectedClient?.id === client.id}
                onSelect={() => setSelectedClientId(client.id)}
              />
            ))
          ) : (
            <p className="font-medium text-size-base text-placeholder_2 py-space-6">
              No clients found in this category.
            </p>
          )}
        </div>
      </div>

      <div className="w-full h-0.5 rounded-full opacity-20 bg-placeholder"></div>

      {selectedClient ? (
        <ClientInfoSection client={selectedClient} allProjects={projectsData} />
      ) : (
        <div className="bg-secondary-50 rounded-[16px] min-h-[300px] flex items-center justify-center">
          <p className="font-medium text-size-base text-placeholder_2">
            Select a client to see details
          </p>
        </div>
      )}
    </section>
  );
};

export default page;