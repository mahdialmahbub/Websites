/**
 * Lets any component ask "save the draft right now" without prop drilling.
 * <BuilderSync /> registers the real saver; everyone else calls saveBuilderNow().
 */
let saver = null;

export const registerSaver = (fn) => {
  saver = fn;
  return () => {
    if (saver === fn) saver = null;
  };
};

/**
 * Saves pending changes right now (creating the server resume if it does not exist yet). Guests and logged-in users alike.
 * Resolves { resumeId: null } only when no saver is mounted.
 * @returns {Promise<{ resumeId: string | null }>}
 */
export const saveBuilderNow = () => (saver ? saver({ force: true }) : Promise.resolve({ resumeId: null }));
