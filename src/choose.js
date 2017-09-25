export default function choose(obj, defn, paths) {
  const { type, ...payload } = obj;
  if (!type) {
    throw new Error('missing type to choose with');
  }
  if (!defn.hasOwnProperty(type)) {
    const possible = Object.keys(defn || {});
    throw new Error(`type '${type}' is not one of [${possible.join(', ')}]`);
  }
  const path = paths[type];
  if (!path) {
    const possible = Object.keys(paths || {});
    throw new Error(`no path for type '${type}' (of [${possible.join(', ')}])`);
  }
  return path(payload);
}
