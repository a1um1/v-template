import { authMiddleware } from "@server/constant/authMiddleware";
import AdminRoute from "@server/routes/admin";
import CustomerRoute from "@server/routes/customer";
import Elysia from "elysia";

const ApiRoute = new Elysia({
  prefix: "",
})
  .use(authMiddleware)
  .get("/", async () => {
    return {
      appVersion: __APP_VERSION__ || "Development",
    };
  })
  .use(CustomerRoute)
  .use(AdminRoute);

export default ApiRoute;
