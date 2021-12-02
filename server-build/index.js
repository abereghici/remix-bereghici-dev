var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_path = __toModule(require("path"));
var import_on_finished = __toModule(require("on-finished"));
var import_express = __toModule(require("express"));
var import_compression = __toModule(require("compression"));
var import_morgan = __toModule(require("morgan"));
var import_express2 = __toModule(require("@remix-run/express"));
var import_globals = __toModule(require("@remix-run/node/globals"));
(0, import_globals.installGlobals)();
const here = (...d) => import_path.default.join(__dirname, ...d);
const MODE = process.env.NODE_ENV;
const BUILD_DIR = import_path.default.join(process.cwd(), "build");
const app = (0, import_express.default)();
app.use((req, res, next) => {
  res.set("X-Powered-By", "bereghici.dev");
  res.set("X-Fly-Region", process.env.FLY_REGION ?? "unknown");
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
  next();
});
app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto");
  const host = req.get("X-Forwarded-Host") ?? req.get("host");
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});
app.use((0, import_compression.default)());
const publicAbsolutePath = here("../public");
app.use(import_express.default.static(publicAbsolutePath, {
  maxAge: "1w",
  setHeaders(res, resourcePath) {
    const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, "");
    if (relativePath.startsWith("build/info.json")) {
      res.setHeader("cache-control", "no-cache");
      return;
    }
    if (relativePath.startsWith("fonts") || relativePath.startsWith("build")) {
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
    }
  }
}));
app.use((0, import_morgan.default)("tiny"));
app.use((req, res, next) => {
  (0, import_on_finished.default)(res, () => {
    const referrer = req.get("referer");
    if (res.statusCode === 404 && referrer) {
      console.info(`\u{1F47B} 404 on ${req.method} ${req.path} referred by: ${referrer}`);
    }
  });
  next();
});
app.all("*", MODE === "production" ? (0, import_express2.createRequestHandler)({ build: require("../build") }) : (req, res, next) => {
  purgeRequireCache();
  return (0, import_express2.createRequestHandler)({ build: require("../build"), mode: MODE })(req, res, next);
});
const port = process.env.PORT ?? 3e3;
app.listen(port, () => {
  require("../build");
  console.log(`Express server listening on port ${port}`);
});
function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
