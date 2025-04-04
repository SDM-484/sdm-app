import Header from "@/components/Header";
import "../styles/globals.css";
import Providers from "@/components/Providers";
import '@ant-design/v5-patch-for-react-19';
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "Stomatoloji Diaqnostika Merkezi",
  description: "Stomatoloji Diaqnostika Mərkəzi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <div><Toaster/></div>
        </Providers>
      </body>
    </html>
  );
}
