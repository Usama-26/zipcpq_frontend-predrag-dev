/* eslint-disable prettier/prettier */
import {Disclosure, Menu, Transition} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, {Fragment, useState} from 'react';

import {ChevronRightIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import {Explorer} from '@/modules/explorer';
export default function HomeLayout({children}: any) {
  const router = useRouter();
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  return (
    <div className="font-poppins">
      <header className="mx-10 py-5 text-zinc-700">
        <div className="flex mx-auto container justify-between items-center">
          <div>
            <Link href={'/'}>
              <Image
                src={'/images/logo.png'}
                height={103}
                width={252}
                alt={'Conway Machines Logo'}
                className={'w-36 object-cover'}
              />
            </Link>
          </div>
          <menu className="user-menu flex justify-between items-center">
            <div className=" pr-4 py-2 flex gap-4 border-r border-zinc-700">
              <label htmlFor="search" className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search"
                  className={`bg-white shadow rounded-full py-2 border px-4 focus:outline-none focus:border transition-all translate-x-10 -z-10 text-sm ${
                    isSearchBarVisible ? 'w-64 visible' : 'w-0 invisible'
                  }`}
                />
              </label>
              <button
                onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
                className={'z-10'}
              >
                <Image
                  src={'/icons/search.svg'}
                  height={16}
                  width={16}
                  alt={'Search Icon'}
                />
              </button>
              <button className="relative">
                <span className="absolute top-0 -right-2.5 px-1 bg-red-400 rounded-sm text-white font-medium text-[10px]">
                  3
                </span>
                <Image
                  src={'/icons/cart.svg'}
                  height={15}
                  width={15}
                  alt={'Cart Icon'}
                />
              </button>
            </div>
            <div className="pl-4">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex py-2 items-center gap-4 hover:text-yellow-700">
                    <Image
                      src={'/icons/profile.svg'}
                      height={15}
                      width={15}
                      alt={'Profile Icon'}
                    />
                    <span className="hidden sm:inline">Hello, Emma!</span>
                    <Image
                      src={'/icons/chevron.svg'}
                      height={6}
                      width={10}
                      alt={'Arrow Down Icon'}
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({active}) => (
                          <button
                            className={`${
                              active
                                ? 'bg-zinc-700/50 text-white'
                                : 'text-yellow-700'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            My Account
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({active}) => (
                          <button
                            className={`${
                              active
                                ? 'bg-zinc-700/50 text-white'
                                : 'text-red-700'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <button className="inline-flex items-center gap-4"></button>
            </div>
          </menu>
        </div>
      </header>
      <div className="yellow-stripe bg-yellow-700 h-16"></div>

      <main className="container mx-auto relative 2xl:px-20 py-5 text-zinc-700">
        {/* Breadcrumb */}
        <div className=" text-sm breadcrumbs">
          <ul>
            <li>
              <Link href={'/catalog'}>Product Catalog</Link>
            </li>
            {router?.query?.name && (
              <li>
                <Link href={(router?.query?.name).toString().toLowerCase()}>
                  {router?.query?.name}
                </Link>
              </li>
            )}
            {/* <li>
                  <span className="text-yellow-700">900</span>
                </li> */}
          </ul>
        </div>
        <div className="flex  gap-4 mx-auto pb-5">{children}</div>
      </main>
    </div>
  );
}
