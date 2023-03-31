/* eslint-disable prettier/prettier */
import {Disclosure} from '@headlessui/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import categories from './../../json/categories.json';
export function Explorer() {
  return (
    <aside className="max-w-xs min-w-[256px]">
      <div className="mb-6">
        <h5 className="text-2xl">Product Catalog</h5>
      </div>
      <div className="categories border p-3 border-[#c0c0c0] rounded-md">
        <ul className="text-black">
          {categories.map((category, index) => {
            return (
              <li key={index}>
                <Disclosure as="div">
                  {({open}) => (
                    <>
                      <div
                        className={`flex justify-between items-center rounded-md hover:bg-yellow-700 ${
                          open && 'bg-yellow-700'
                        }`}
                      >
                        <Link
                          href={{
                            pathname: `/catalog/${category.name.toLowerCase()}`,
                            query: category,
                          }}
                          as={`/catalog/${category.name.toLowerCase()}`}
                          className={'w-full p-2'}
                        >
                          <span>{category.name}</span>
                        </Link>
                        <Disclosure.Button
                          className={`p-2 ${
                            open && 'border-l border-zinc-700/50'
                          }`}
                        >
                          <ChevronRightIcon
                            className={`w-4 ${open ? 'rotate-90' : 'rotate-0'}`}
                          />
                        </Disclosure.Button>
                      </div>
                      <Disclosure.Panel className=" px-2 py-2 text-sm bg-gray-50">
                        <ul className="category-variants-list">
                          {category.variants.map(variant => {
                            return (
                              <li key={variant}>
                                <button
                                  value={variant}
                                  className="category-variant-btn py-1 inline-flex items-center hover:font-bold"
                                >
                                  <ChevronRightIcon
                                    className={'chevron w-3 mr-1 invisible'}
                                  />
                                  <span>{variant}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
