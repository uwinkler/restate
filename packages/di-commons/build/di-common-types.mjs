function isMessageDevTools(msg) {
  return msg?.data?.source === "restate-di-devtools";
}
export {
  isMessageDevTools
};
