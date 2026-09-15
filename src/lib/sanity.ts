import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: unknown) {
  return builder.image(source as any);
}

export type SanityProject = {
  _id: string;
  project: string;
  slug: string;
  role?: string;
  title?: string;
  year?: string;
  tag?: string;
  orientation?: "landscape" | "portrait";
  poster: unknown;
  muxPlaybackId?: string;
  videoSrc?: string;
  videoWebm?: string;
  showCredits?: boolean;
  credits?: string;
};

const projectsQuery = `*[_type == "project"] | order(orderRank asc) {
  _id,
  project,
  "slug": slug.current,
  role,
  title,
  year,
  tag,
  orientation,
  poster,
  "uploadedPlaybackId": video.asset->playbackId,
  muxPlaybackId,
  videoSrc,
  videoWebm,
  showCredits,
  credits
}`;

type RawSanityProject = SanityProject & { uploadedPlaybackId?: string };

export async function getWorkItems() {
  const items = await sanityClient.fetch<RawSanityProject[]>(projectsQuery);
  return items.map((item) => ({
    ...item,
    muxPlaybackId: item.uploadedPlaybackId ?? item.muxPlaybackId,
  }));
}
