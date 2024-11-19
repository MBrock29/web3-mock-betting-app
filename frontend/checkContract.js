const { ethers } = require('ethers');

// Correct the address using ethers.utils.getAddress to ensure it is checksummed
const contractAddress = ethers.getAddress(
  '0xc8140f479959210E1d4739D6c303F4573A18DD3d'
);

// Connect to Sepolia testnet via Alchemy
const provider = new ethers.JsonRpcProvider(
  'https://eth-sepolia.g.alchemy.com/v2/E3bpmyTpH0nVKzk87OMa3iBk4x7r8nzT'
);

async function checkContractCode() {
  try {
    // Fetch the contract code
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
