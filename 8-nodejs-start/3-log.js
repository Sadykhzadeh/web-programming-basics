const log = {
  info: (x) => console.log(`[INFO]: ${x}`),
  warning: (x) => console.warn(`[WARNING]: ${x}`),
  error: (x) => console.error(`[ERROR]: ${x}`),
};

log.info("Hey!");
log.warning("Wow...");
log.error("WTF?!");
