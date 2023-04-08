import {Menu, Transition} from '@headlessui/react';
import {signOut, useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {Fragment, useState} from 'react';
import SearchInput from '@/components/SearchInput';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';

const Header = () => {
  const {data: session, status} = useSession();
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  return (
    <>
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
            <div className=" pr-4 py-2 flex gap-6">
              <label htmlFor="search" className="relative sm:inline hidden">
                <SearchInput isSearchBarVisible={isSearchBarVisible} />
              </label>
              <button
                onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
                className={'z-10 sm:inline hidden'}
              >
                <Image
                  src={'/icons/search.svg'}
                  height={16}
                  width={16}
                  alt={'Search Icon'}
                />
              </button>
              <button className="relative">
                <span className="absolute -top-1 -right-2.5 px-1 bg-red-400 rounded-sm text-white font-medium text-[10px]">
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
            <div className="border-[#76787a80] border h-8 ml-4" />
            <div className="pl-6">
              <Menu as="div" className="z-10 relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex py-2 items-center gap-3 hover:text-yellow-700">
                    <Image
                      src={'/icons/profile.svg'}
                      height={15}
                      width={15}
                      alt={'Profile Icon'}
                    />
                    {session && <span>Hello, Emma!</span>}
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
                    {!session ? (
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          {({active}) => (
                            <Link
                              href="/auth/login"
                              className={`${
                                active
                                  ? 'bg-zinc-700/50 text-white'
                                  : 'text-yellow-700'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Login
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <Link
                              href="/auth/register"
                              className={`${
                                active
                                  ? 'bg-zinc-700/50 text-white'
                                  : 'text-red-700'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Register
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    ) : (
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
                              onClick={() => signOut({redirect: false})}
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
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* <button className="inline-flex items-center gap-4"></button> */}
            </div>
          </menu>
        </div>
      </header>
    </>
  );
};

export default Header;
