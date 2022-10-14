import React, { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useRouter } from "next/router";
import { providers } from "ethers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "../lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface AppContext {
  address: string;
  provider: providers.Web3Provider;
  balance: string;
  disconnect: any;
  connect: any;
  chainId: number;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const EthersContext = React.createContext<AppContext | null>(null);

export const EthersProvider = ({ children }: any) => {
  const [address, setAddress] = useState<null | string>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [web3Provider, setWeb3Provider] =
    useState<null | providers.Web3Provider>(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState<null | number>(null);
  const [token, setToken] = useState<string | null>(null);
  const [secondToken, setSecondToken] = useState<string | null>(null);
  const toast = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  let web3Modal: Web3Modal;
  if (typeof window !== "undefined") {
    const providerOptions = {
      walletconnect: {
        display: {
          name: "Mobile",
        },
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK, 
        options: {
          appName: "Web 3 Modal Demo",
          infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY, 
        }
      },
    };
    web3Modal = new Web3Modal({
      //! network: "polygon",
      network: "goerli",
      cacheProvider: true,
      providerOptions,
      disableInjectedProvider: false,
    });
  }

  console.log(address);

  const connect = async function () {
    try {
      setLoading(true);
      const provider = await web3Modal.connect();
      const web3Result = new providers.Web3Provider(provider);
      const signer = web3Result.getSigner();
      const accounts = await web3Result.listAccounts();
      const address = await signer.getAddress();
      const network = await web3Result.getNetwork();

      setProvider(provider);
      setWeb3Provider(web3Result);
      if(accounts) {
        setAddress(accounts[0]);
      } else {
        setAddress(address);
      }
      setChainId(network.chainId);
      setLoading(false);
    } catch (e) {
      //! console.log("error");
      console.log(e);
    }
  };

  const disconnect = useCallback(
    async function () {
      setLoading(true);

      if (provider && provider.isCoinbaseWallet) {
        try {
          provider.close();
        } catch (e) { 
          console.log(e)
        }
      } 

      await web3Modal.clearCachedProvider();
      if (provider) {
        if (provider.disconnect && typeof provider.disconnect === "function") {
          try {
            await provider.disconnect();
          } catch (e) {
            console.log(e);
          }
        }
      }

      setAddress(null);
      setProvider(null);
      setWeb3Provider(null);
      setBalance(null);
      setChainId(null);
      setLoading(false);
    },
    [provider]
  );

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: any) => {
        console.log("accountsChanged", accounts);
        setAddress(accounts[0]);
      };

      const handleChainChanged = (_hexChainId: any) => {
        router.reload();
      };

      const handleDisconnect = (error: any) => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const getUser = async () => {
    const { data } = await axios.post(`/getUser`, {
      address: address,
      token: token,
    });

    if (!data.data) {
      onOpen();
    } else {
      if (!executeRecaptcha) {
        toast({
          description:
            "An error occured with the robots verification, please try again...",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      const result = await executeRecaptcha("refreshUser");
      if (result) {
        setSecondToken(result);
      } else {
        toast({
          description:
            "An error occured with the robots verification, please try again...",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  };

  const refreshUser = async () => {
    await axios.post(`/refreshUserData`, {
      address: address,
      token: secondToken,
    });
  };

  useEffect(() => {
    if (secondToken && address) {
      refreshUser();
    }
  }, [secondToken]);

  useEffect(() => {
    if (token && address) {
      getUser();
    }
  }, [token]);

  const checkUserExist = async () => {
    if (!executeRecaptcha) {
      toast({
        description:
          "An error occured with the robots verification, please try again...",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const result = await executeRecaptcha("getUser");
    if (result) {
      setToken(result);
    } else {
      toast({
        description:
          "An error occured with the robots verification, please try again...",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (address) {
      checkUserExist();
    }
  }, [address]);

  return (
    <EthersContext.Provider
      value={{
        address: address!,
        provider: web3Provider!,
        balance: balance!,
        disconnect: disconnect,
        connect: connect,
        chainId: chainId!,
        loading: loading,
        isOpen,
        onClose,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
};

export default EthersContext;
