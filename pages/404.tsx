import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../components/Layout/Layout";

const NotFoundPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <Box h="95vh" w="100%" textAlign="center" pt="xl">
        <h1>404: Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Box>
    </Layout>
  );
};

export default NotFoundPage;
