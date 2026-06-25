import { convertToRouteModule } from "@/utils/load-module";

export const ScenesRoute = convertToRouteModule(import("./scenes.module"));
export default ScenesRoute;
