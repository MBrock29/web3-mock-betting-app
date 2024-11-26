import { Network, Alchemy } from 'alchemy-sdk';
import { JsonRpcProvider } from 'ethers';
import { Contract } from 'ethers/contract';

const settings = {
  apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

const provider = new JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${settings.apiKey}`
);

export const contractConfig = {
  address: '0xB4E5710a8329EE5b6c34B18Bbb848e3A2d74ed47',
  abi: [
    { type: 'constructor', inputs: [], stateMutability: 'payable' },
    {
      type: 'function',
      name: 'betAwayTeam',
      inputs: [
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
        { name: 'odds', type: 'uint256', internalType: 'uint256' },
        { name: 'perc', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'betDraw',
      inputs: [
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
        { name: 'odds', type: 'uint256', internalType: 'uint256' },
        { name: 'perc', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'betHomeTeam',
      inputs: [
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
        { name: 'odds', type: 'uint256', internalType: 'uint256' },
        { name: 'perc', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'deposit',
      inputs: [],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'getBalance',
      inputs: [
        { name: 'userAddress', type: 'address', internalType: 'address' },
      ],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getContractBalance',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getIndividualPlayer',
      inputs: [{ name: 'addr', type: 'address', internalType: 'address' }],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct Game.Player',
          components: [
            { name: 'walletAddress', type: 'address', internalType: 'address' },
            { name: 'balance', type: 'uint256', internalType: 'uint256' },
            { name: 'hasDeposited', type: 'bool', internalType: 'bool' },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getRandomNumber',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getResult',
      inputs: [],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'owner',
      inputs: [],
      outputs: [{ name: '', type: 'address', internalType: 'address' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'payoutAmount',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'players',
      inputs: [{ name: '', type: 'address', internalType: 'address' }],
      outputs: [
        { name: 'walletAddress', type: 'address', internalType: 'address' },
        { name: 'balance', type: 'uint256', internalType: 'uint256' },
        { name: 'hasDeposited', type: 'bool', internalType: 'bool' },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'withdraw',
      inputs: [
        { name: 'balanceAmount', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'event',
      name: 'BetResult',
      inputs: [
        {
          name: 'player',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'amountWon',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Deposit',
      inputs: [
        {
          name: 'userAddress',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'weiAmount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: 'contractBalance',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Withdraw',
      inputs: [
        {
          name: 'userAddress',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'weiAmount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: 'contractBalance',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
  ],
  provider,
};

// Connect to the contract using the provider and contract settings
const contract = new Contract(
  contractConfig.address,
  contractConfig.abi,
  provider
);

// Example function: Interact with the contract's withdrawOwner function
const withdrawOwner = async (signer) => {
  try {
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.withdrawOwner();
    console.log('Transaction sent:', tx.hash);
    await tx.wait(); // Wait for transaction confirmation
    console.log('Owner withdrawal successful');
  } catch (error) {
    console.error('Error during owner withdrawal:', error);
  }
};

export { alchemy, contract, withdrawOwner };
