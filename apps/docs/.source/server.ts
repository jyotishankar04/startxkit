// @ts-nocheck
import * as __fd_glob_15 from "../content/docs/cli/info.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/cli/doctor.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/cli/add-module.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/frameworks/hono.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/frameworks/fastify.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/frameworks/express.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/architectures/modular.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/architectures/minimal.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/architectures/layered.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/roadmap.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/getting-started.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/cli/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/frameworks/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/architectures/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "architectures/meta.json": __fd_glob_1, "frameworks/meta.json": __fd_glob_2, "cli/meta.json": __fd_glob_3, }, {"getting-started.mdx": __fd_glob_4, "index.mdx": __fd_glob_5, "roadmap.mdx": __fd_glob_6, "architectures/layered.mdx": __fd_glob_7, "architectures/minimal.mdx": __fd_glob_8, "architectures/modular.mdx": __fd_glob_9, "frameworks/express.mdx": __fd_glob_10, "frameworks/fastify.mdx": __fd_glob_11, "frameworks/hono.mdx": __fd_glob_12, "cli/add-module.mdx": __fd_glob_13, "cli/doctor.mdx": __fd_glob_14, "cli/info.mdx": __fd_glob_15, });