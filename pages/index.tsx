import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const { contract } = useContract(
    "0x6fD8e3602cbcf7E76b66Db91633C69556A03319F"
  );

  const [stakingInfo, setStakingInfo] = useState({
    stakedNFTs: "-",
    tokenRewards: "-",
  });

  const fetchInfo = async () => {
    if (address && contract) {
      try {
        const info = await contract.functions.userStakeInfo(address);
        setStakingInfo({
          stakedNFTs: info._tokensStaked.toString(),
          tokenRewards: ethers.utils.formatEther(info._availableRewards),
        });
      } catch (e) {
        console.log(e);
        setStakingInfo({
          stakedNFTs: "0",
          tokenRewards: "0",
        });
      }
    }
  };

  const claimRewards = async () => {
    if (address && contract) {
      const tx = await contract.functions.claimRewards();
      await tx.wait();
      console.log("Claimed rewards!");
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [address, contract]);

  return (
    <>
      <div>
        {address ? (
          <>
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
            <p>Your address: {address}</p>
          </>
        ) : (
          <button onClick={connectWithMetamask}>Connect with Metamask</button>
        )}
      </div>
      <hr />
      {address ? (
        <>
          {stakingInfo ? (
            <>
              <h2>Currently staking: {stakingInfo.stakedNFTs} NFTs</h2>
              <h2>Your earned: {stakingInfo.tokenRewards} Tokens</h2>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => fetchInfo()}>Refresh</button>
                <button onClick={() => claimRewards()}>Claim Rewards</button>
              </div>
            </>
          ) : (
            <h3>loading...</h3>
          )}
        </>
      ) : (
        <h3>Connect your wallet to see your rewards</h3>
      )}
    </>
  );
};

export default Home;
