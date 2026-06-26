import { convertToRouteModule } from "@/utils/load-module";

export const PreviewRoute = convertToRouteModule(import("./preview.module"));
export default PreviewRoute;
