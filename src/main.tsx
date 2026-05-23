import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./app/App";
import "./index.css";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.info("한자몽을 오프라인에서도 사용할 수 있습니다.");
  },
  onNeedRefresh() {
    console.info("새 버전이 있습니다. 다음 방문 시 자동으로 반영됩니다.");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
