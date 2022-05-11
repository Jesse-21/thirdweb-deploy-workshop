import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
  useNFTCollection,
  useNFTs,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const { contract } = useContract(
    "0x74f978051577F0E940fE8B15E9ac2d4A9d3Bf099"
  );

  const [stakingInfo, setStakingInfo] = useState({
    stakedNFTs: "0",
    tokenRewards: "0",
  });

  const fetchInfo = async () => {
    if (address && contract) {
      const info = await contract.functions.userStakeInfo(address);
      console.log(info);
      setStakingInfo({
        stakedNFTs: info._tokensStaked.toString(),
        tokenRewards: ethers.utils.formatEther(info._availableRewards),
      });
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
      {address && stakingInfo ? (
        <>
          <h2>Tokens staked: {stakingInfo.stakedNFTs} NFTs</h2>
          <h2>Your reward is: {stakingInfo.tokenRewards} ETH</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => fetchInfo()}>Refresh</button>
            <button onClick={() => claimRewards()}>Claim Rewards</button>
          </div>
        </>
      ) : undefined}
    </>
  );
};

export default Home;
