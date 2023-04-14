import {Disclosure, Menu, Transition} from '@headlessui/react';
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {TCategory} from '_types/types';
import {TBreadCrumb} from '_types/ui';
import {Suspense, useEffect, useState} from 'react';
import {isSideBarCategoryOpen} from 'utils/helper';

interface ISidebarProps {
  breadcrumb?: TBreadCrumb[];
}

const SidebarAccounts = ({breadcrumb}: ISidebarProps) => {
  const {query, pathname} = useRouter();
  const [showSideBar, setShowSideBar] = useState(true);
  useEffect(() => {
    setShowSideBar(false);
    setTimeout(() => {
      setShowSideBar(true);
    }, 1);
  }, [query.slug]);

  console.log(pathname);

  return (
    <aside className="max-w-sm min-w-[256px] h-[700px]">
      <div className="mb-6">
        <h5 className="text-2xl">Account Settings</h5>
      </div>

      <div className="categories border p-3 border-[#c0c0c0] rounded-md flex flex-col h-[550px] justify-between">
        <div>
          <div
            className={`flex justify-between items-center pr-1 rounded-md hover:bg-yellow-700 hover:text-black ${
              pathname === '/accounts' && 'bg-yellow-700 text-black'
            }`}
          >
            <Link href={'/accounts'} className={'w-full p-2'}>
              <span>Account Details</span>
            </Link>

            <ChevronRightIcon className={'w-4'} />
          </div>

          <div
            className={`flex justify-between items-center pr-1 rounded-md hover:bg-yellow-700 hover:text-black ${
              pathname === '/accounts/passwords' && 'bg-yellow-700 text-black'
            }`}
          >
            <Link href={'/accounts/passwords'} className={'w-full p-2'}>
              <span>Passwords</span>
            </Link>

            <ChevronRightIcon className={'w-4'} />
          </div>
        </div>

        <div
          className={`flex justify-between items-center pr-1 rounded-md hover:bg-yellow-700 hover:text-black ${
            pathname === '/accounts/deactivate' && 'bg-yellow-700 text-black'
          }`}
        >
          <Link href={'/accounts/deactivate'} className={'w-full p-2'}>
            <span>Deactivate Account</span>
          </Link>

          <ChevronRightIcon className={'w-4 '} />
        </div>
      </div>
    </aside>
  );
};

export default SidebarAccounts;
