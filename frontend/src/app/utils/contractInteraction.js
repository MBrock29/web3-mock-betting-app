import { sepolia } from 'wagmi/chains';
import { contractConfig } from './contractConfig';
import { getPublicClient, getWalletClient } from '@wagmi/core';
import { Contract, JsonRpcProvider } from 'ethers';

export const getContract = async () => {
  const publicClient = getPublicClient({ chainId: sepolia.id });
  const provider = new JsonRpcProvider(publicClient.transport.url);
  return new Contract(contractConfig.address, contractConfig.abi, provider);
};

export const getLatestBlock = async () => {
  const publicClient = getPublicClient({ chainId: sepolia.id });
  try {
    const blockNumber = await publicClient.getBlockNumber();
    console.log('Latest block:', blockNumber);
    return blockNumber;
  } catch (error) {
    console.error('Error fetching the latest block:', error);
    throw error;
  }
};

export const withdrawOwner = async () => {
  const walletClient = await getWalletClient({ chainId: sepolia.id });
  if (!walletClient) throw new Error('Wallet not connected');

  const contract = await getContract();
  try {
    const { request } = await contract.withdrawOwner.populateTransaction();
    const hash = await walletClient.sendTransaction(request);
    console.log('Transaction sent:', hash);
    const publicClient = getPublicClient({ chainId: sepolia.id });
    await publicClient.waitForTransactionReceipt({ hash });
    console.log('Owner withdrawal successful');
    return hash;
  } catch (error) {
    console.error('Error during owner withdrawal:', error);
    throw error;
  }
};
