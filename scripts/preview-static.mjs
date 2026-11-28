import { createStaticServer } from "./static-server.mjs";

createStaticServer().listen(3220, "127.0.0.1", () => {
  console.log("GENYX static preview: http://127.0.0.1:3220");
});
