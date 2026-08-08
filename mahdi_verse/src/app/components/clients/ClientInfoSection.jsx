import ProjectCard from "../ProjectCard";
import StarRating from "../project/StarRating";
import Chips from "../Chips";
import Image from "next/image";
import { getClientProjects } from "../../../../public/clients/clients";


export default function ClientInfoSection({ client, allProjects = [] }) {
  const clientProjects = getClientProjects(client.id, allProjects);

  return (
    <div className="w-full rounded-2xl bg-secondary-50 p-6">
      <div className="flex items-center justify-between gap-space-6 ">
        <div className="flex items-center gap-4 w-full">
          <div className="w-28 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
            {client.Image && (
              <Image
                src={client.Image}
                alt={client.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="">
            <h2 className="text-size-xl font-semibold text-slate-900">
              {client.name}
            </h2>
            <p className="text-size-base text-placeholder_2 mt-2 max-w-2xl">
              {client.shortIntro}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StarRating rating={client.rating} size={16} />
          <Chips text={client.mood} fullWidth />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-8">
        <h3 className="text-size-base font-semibold text-placeholder_2">
          Projects of this client
        </h3>
        <Chips text={clientProjects.length} />
      </div>

      {clientProjects.length === 0 ? (
        <p className="text-size-base text-placeholder_2">
          No projects linked to this client yet.
        </p>
      ) : (
        <div className="flex gap-5 flex-wrap">
          {clientProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}