const { ethers } = require('ethers');

const contractAddress = ethers.getAddress(
  '0xc8140f479959210E1d4739D6c303F4573A18DD3d'
);

const provider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

async function checkContractCode() {
  try {
    const code = await provider.getCode(contractAddress);

    if (code === '0x') {
      console.log('No contract is deployed at this address.');
    } else {
      console.log('Contract code found:', code);
    }
  } catch (error) {
    console.error('Error checking contract code:', error);
  }
}

checkContractCode();
