import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import customTheme from "../utils/theme";
import { EthersProvider } from "../context/ethersProviderContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "../styles/globals.scss";
import "../fonts/font.css";

const theme = extendTheme(customTheme);

function MyApp({ Component, pageProps }: any) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
    >
      <EthersProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </EthersProvider>
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
