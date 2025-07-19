import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
// import { LoadingProvider } from "~~/components/loading/LoadingProvider";  注释掉了加载组件
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

// ✅ 新增这一行

export const metadata = getMetadata({ title: "Web3平台", description: "构建权威平台" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            {/* <LoadingProvider> */}
            {/* ✅ 包裹 loading 监听逻辑 */}
            {children}
            {/* </LoadingProvider> */}
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
