import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'Mock betting app',
  projectId: 'dd1e13a44730c7a3a125a650957775d2',
  chains: [sepolia],
});
