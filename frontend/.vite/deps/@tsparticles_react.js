import {
  require_jsx_runtime
} from "./chunk-LBEETZ2E.js";
import {
  tsParticles
} from "./chunk-U5GCJDNQ.js";
import {
  require_react
} from "./chunk-OELA7GPI.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tsparticles+react@3.0.0_@tsparticles+engine@3.5.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@tsparticles/react/dist/Particles.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react = __toESM(require_react(), 1);
var f = (t) => {
  const i = t.id ?? "tsparticles";
  return (0, import_react.useEffect)(() => {
    let e;
    return tsParticles.load({ id: i, url: t.url, options: t.options }).then((l) => {
      var a;
      e = l, (a = t.particlesLoaded) == null || a.call(t, l);
    }), () => {
      e == null || e.destroy();
    };
  }, [i, t, t.url, t.options]), (0, import_jsx_runtime.jsx)("div", { id: i, className: t.className });
};

// node_modules/.pnpm/@tsparticles+react@3.0.0_@tsparticles+engine@3.5.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@tsparticles/react/dist/index.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var import_react2 = __toESM(require_react());
async function n(t) {
  await t(tsParticles);
}
export {
  f as Particles,
  f as default,
  n as initParticlesEngine
};
//# sourceMappingURL=@tsparticles_react.js.map
