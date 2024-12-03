import React from 'react';
import { CiSettings } from 'react-icons/ci';
import { useAppContext } from '../AppContext';

export const Settings = ({ handleDisconnect }) => {
  const { fractions, handleChange, setSettings, settings, settingsFunction } =
    useAppContext();

  return (
    <div>
      {settings ? (
        <div className='flex flex-col items-center'>
          <CiSettings
            onClick={() => setSettings(false)}
            size='35px'
            className='cursor-pointer'
          />
          <div className='flex text-sm items-center'>
            <p className='mr-1'>Odds display:</p>
            <select
              value={fractions ? 'Fractions' : 'Decimals'}
              onChange={handleChange}
              className='bg-[#4A5568] mt-1 rounded-full px-1 pb-0.5 font-bold focus-visible:outline-none'
            >
              <option value='Fractions'>Fractions</option>
              <option value='Decimals'>Decimals</option>
            </select>
          </div>
          <button onClick={() => handleDisconnect()} className='text-sm mt-2'>
            Log out
          </button>
        </div>
      ) : (
        <CiSettings
          onClick={settingsFunction}
          size='35px'
          className='cursor-pointer'
        />
      )}
    </div>
  );
};
