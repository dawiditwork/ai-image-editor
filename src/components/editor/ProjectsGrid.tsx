"use client";

import { Image as ImageIcon } from "lucide-react";
import { Image as ImageKitImage } from "@imagekit/next";
import { env } from "~/env";
import type { Project } from "~/types/editor";


interface ProjectsGridProps {
  isLoadingProjects: boolean;
  userProjects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectsGrid({
  isLoadingProjects,
  userProjects,
  onProjectClick,
}: ProjectsGridProps) {
  return (
    <>
      {isLoadingProjects ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <div className="animate-reverse absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-r-purple-600"></div>
          </div>

          <div className="text-center">
            <p className="mb-2 text-lg font-semibold text-gray-900">
              Loading your projects...
            </p>

            <p className="text-muted-foreground text-sm">
              Fetching your creative works
            </p>
          </div>
        </div>
      ) : userProjects.length > 0 ? (
        <div className="mb-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {userProjects.slice(0, 12).map((project) => (
              <div
                key={project.id}
                className="group relative cursor-pointer"
                onClick={() => onProjectClick(project)}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-600/0 transition-all duration-500 group-hover:from-blue-500/20 group-hover:to-purple-600/20"></div>

                  <div className="relative h-full w-full overflow-hidden">
                    <ImageKitImage
                      urlEndpoint={env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                      src={project.filePath}
                      alt={project.name ?? "Project"}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      transformation={[
                        {
                          width: 300,
                          height: 300,
                          crop: "maintain_ratio",
                          quality: 90,
                        },
                      ]}
                    />

                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-transform duration-1000 group-hover:translate-x-full group-hover:opacity-100"></div>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 transform bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <div className="space-y-1">
                      <h3 className="truncate text-sm font-bold text-white drop-shadow-lg">
                        {project.name ?? "Untitled Project"}
                      </h3>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white/90 drop-shadow-md">
                          {new Date(project.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>

                        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
                            <span className="text-xs font-medium text-white">
                              Edit
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 h-0 w-0 border-t-[20px] border-l-[20px] border-t-blue-500 border-l-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </div>
            ))}
          </div>

          {userProjects.length > 12 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>

                <span className="text-sm font-medium text-blue-700">
                  Showing 12 of {userProjects.length} projects
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="relative mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-blue-100 to-purple-100"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-blue-200 to-purple-200"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white shadow-lg">
              <ImageIcon className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              No projects yet
            </h3>

            <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
              Start your creative journey by uploading your first image and
              transforming it with AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}