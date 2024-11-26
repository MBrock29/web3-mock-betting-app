import React, { useState, useEffect } from 'react';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';
import { Settings } from './Settings';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = ({ balance, refetch, handleDisconnect }) => {
  const { isConnected, chain } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showOptions = mounted && isConnected && chain?.id === 11155111;

  return (
    <div className='flex w-full my-5 text-sm sm:text-xl font-bold min-h-[80px] text-center'>
      <div className='w-1/5 ml-5 text-center'>
        <div>
          <p>Balance: {(Math.floor(balance * 100) / 100).toFixed(2)}</p>
        </div>
      </div>
      <h3 className='w-1/5'>0.1 test ETH = 1000 credits</h3>
      {showOptions && (
        <>
          <div className='flex flex-col w-1/5 items-center'>
            <Deposit refetch={refetch} />
          </div>
          <div className='flex flex-col w-1/5 items-center'>
            <Withdraw refetch={refetch} />
          </div>
          <div className='flex flex-col w-1/5 items-center'>
            <Settings handleDisconnect={handleDisconnect} />
          </div>
        </>
      )}
      {!showOptions && (
        <div className='flex flex-col w-3/5 items-center'>
          <ConnectButton />
        </div>
      )}
    </div>
  );
};

export default Header;
