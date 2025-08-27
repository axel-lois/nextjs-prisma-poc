import Fuse, { IFuseOptions } from "fuse.js";
import { Post } from "@/types";
import { FUSE_THRESHOLD } from "@/constants";

export function createFuseInstance<T>(
  items: T[],
  keys: string[],
  options?: IFuseOptions<T>
): Fuse<T> {
  return new Fuse(items, {
    keys,
    threshold: FUSE_THRESHOLD,
    includeScore: true,
    ...options,
  });
}

export function filterWithFuse<T>(
  items: T[],
  query: string,
  fuseInstance: Fuse<T>
): T[] {
  if (query.trim() === "") {
    return items;
  }
  return fuseInstance.search(query).map((result) => result.item);
}

export function searchPosts(posts: Post[], query: string): Post[] {
  const fuse = createFuseInstance(posts, ["title", "body", "user.name"]);
  return filterWithFuse(posts, query, fuse);
}
