import { HttpStatusCode } from "@angular/common/http";
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";

import { Registries, RegistryLoader } from "./utils/registries.loader";

import { environment } from "./environments/environment";
import { ScenesLoader } from "./services/scenes.loader";

import { join } from "node:path";
import express from "express";

const browserDistFolder = join(import.meta.dirname, "../browser");

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: environment.ALLOWED_HOSTS
});

app.use(express.json());

app.get("/api/characters", async (_, res) => {
  const loader = new RegistryLoader(environment.REGISTRIES_PATH);
  const data = await loader.execute("characters");

  res.json(data);
});

const REGISTRIES: Record<keyof Registries, string> = {
  variables: "Переменные",
  characterAnimations: "Персонажи_Анимации",
  characters: "Персонажи",
  events: "События",
  backgroundAnimations: "Фон_Анимации",
  emotions: "Эмоции",
  gameEffects: "Эффекты",
};

app.get("/api/registries/:registry", async (req, res) => {
  const { registry } = req.params;

  if (!(registry in REGISTRIES)) {
    res.sendStatus(500);
    return;
  }

  const loader = new RegistryLoader(environment.REGISTRIES_PATH);
  const data = await loader.execute(registry as keyof Registries);

  res.json({data});
});

app.get("/api/scenes", async (_, res) => {
  const promise = new ScenesLoader(environment.SCENES_PATH).execute();

  promise
    .then((scenes) => {
      res.send(scenes);
    })
    .catch(() => {
      res.sendStatus(HttpStatusCode.InternalServerError);
    });
});

app.get("/api/scenes/:id", async (req, res) => {
  const { id } = req.params;

  const promise = new ScenesLoader(environment.SCENES_PATH).execute(id);

  promise
    .then((scenes) => {
      res.send(scenes);
    })
    .catch(() => {
      res.sendStatus(HttpStatusCode.BadRequest);
    });
});

app.use(
  express.static(browserDistFolder, {
    maxAge: "1y",
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env["pm_id"]) {
  const port = process.env["PORT"] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
