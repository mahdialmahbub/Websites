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
 * Saves pending changes (creating the server resume if it does not exist yet).
 * Guests: resolves { resumeId: null } - nothing to save, the draft lives in the browser.
 * @returns {Promise<{ resumeId: string | null }>}
 */
export const saveBuilderNow = () => (saver ? saver({ force: true }) : Promise.resolve({ resumeId: null }));
