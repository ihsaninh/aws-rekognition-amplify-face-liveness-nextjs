import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../src/aws-exports";
Amplify.configure(awsExports);

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default withAuthenticator(App);