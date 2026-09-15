import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const rootDir = path.resolve(import.meta.dirname, "..");
const workJsonPath = path.join(rootDir, "src/data/work.json");
const publicDir = path.join(rootDir, "public");

const sanityConfigPath = path.join(os.homedir(), ".config/sanity/config.json");
const { authToken } = JSON.parse(readFileSync(sanityConfigPath, "utf-8"));

const client = createClient({
  projectId: "11hecj8j",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: authToken,
  useCdn: false,
});

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function overlayToCredits(overlay) {
  if (!overlay) return undefined;
  return overlay
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

async function uploadPoster(posterPath) {
  const filePath = path.join(publicDir, posterPath.replace(/^\//, ""));
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(filePath),
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function main() {
  const items = JSON.parse(readFileSync(workJsonPath, "utf-8"));
  const usedSlugs = new Set();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let slug = slugify(item.project || `project-${i}`);
    while (usedSlugs.has(slug)) {
      slug = `${slug}-${i}`;
    }
    usedSlugs.add(slug);

    const doc = {
      _type: "project",
      order: i,
      project: item.project,
      slug: { _type: "slug", current: slug },
      role: item.role || undefined,
      title: item.title || undefined,
      year: item.year || undefined,
      tag: item.tag || undefined,
      orientation: item.orientation || "landscape",
      muxPlaybackId: item.muxPlaybackId || undefined,
      videoSrc: item.videoSrc || undefined,
      videoWebm: item.videoWebm || undefined,
      credits: overlayToCredits(item.overlay),
    };

    if (item.poster) {
      try {
        doc.poster = await uploadPoster(item.poster);
      } catch (err) {
        console.warn(`Could not upload poster for "${item.project}": ${err.message}`);
      }
    }

    const created = await client.create(doc);
    console.log(`Created "${item.project}" -> ${created._id} (slug: ${slug})`);
  }

  console.log(`\nDone. Migrated ${items.length} projects.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
