import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Workshop: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const { contract } = useContract(
    "0xb5f0F39DD73212c8D3E6280bf877D4cbF76323d3"
  );

  const [stakingInfo, setStakingInfo] = useState({
    stakedNFTs: "-",
    tokenRewards: "-",
  });

  const fetchInfo = async () => {
    if (address && contract) {
      const info = await contract.functions.userStakeInfo(address);
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
      {address ? (
        <>
          {stakingInfo ? (
            <>
              <h2>Tokens staked: {stakingInfo.stakedNFTs} NFTs</h2>
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

export default Workshop;
