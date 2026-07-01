// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "roadmap.mdx": () => import("../content/docs/roadmap.mdx?collection=docs"), "architectures/layered.mdx": () => import("../content/docs/architectures/layered.mdx?collection=docs"), "architectures/minimal.mdx": () => import("../content/docs/architectures/minimal.mdx?collection=docs"), "architectures/modular.mdx": () => import("../content/docs/architectures/modular.mdx?collection=docs"), "frameworks/express.mdx": () => import("../content/docs/frameworks/express.mdx?collection=docs"), "frameworks/fastify.mdx": () => import("../content/docs/frameworks/fastify.mdx?collection=docs"), "frameworks/hono.mdx": () => import("../content/docs/frameworks/hono.mdx?collection=docs"), "cli/add-module.mdx": () => import("../content/docs/cli/add-module.mdx?collection=docs"), "cli/doctor.mdx": () => import("../content/docs/cli/doctor.mdx?collection=docs"), "cli/info.mdx": () => import("../content/docs/cli/info.mdx?collection=docs"), }),
};
export default browserCollections;