/* eslint-disable prettier/prettier */

import ProductCardExtended from '@/components/ProductCardExtended';
import HomeLayout from '@/layouts/HomeLayout';
import {Explorer} from '@/modules/explorer';
import {Dialog, Popover, Transition} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Fragment, useState} from 'react';
export default function ProductList() {
  const router = useRouter();
  const {name, variants, image}: any = router.query;

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const openModal = () => {
    setFilterModalOpen(true);
  };

  const closeModal = () => {
    setFilterModalOpen(false);
  };

  return (
    <HomeLayout>
      <div className="flex gap-4 mx-auto pb-5">
        <Explorer />
        <div className="mx-2 self-start">
          <div className="flex justify-between items-center mx-2 pb-4 relative">
            <h4 className="self-center font-medium">{name}</h4>
            <div className="mt-5"></div>
            <Popover>
              {({open}) => (
                <>
                  <Popover.Button className="inline-flex items-center gap-2 rounded-md border px-4 py-1 hover:text-black hover:border-black hover:bg-yellow-700">
                    <Image
                      src={'/icons/filter.png'}
                      height={18}
                      width={18}
                      alt={'Filter Icon'}
                    />
                    <span>Filter</span>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute bg-white z-10 max-w-sm px-6 py-4 rounded-md right-0 shadow border mt-2">
                      <h3>Choose the model number of your Bobst die cutter</h3>

                      <div className="flex flex-col flex-wrap max-h-56 my-4 ">
                        {variants?.map((variant: any) => {
                          return (
                            <label
                              key={variant}
                              htmlFor={variant}
                              className="inline-flex gap-2 py-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="checkbox rounded border-2"
                                id={variant}
                              />
                              <span className="font-medium">{variant}</span>
                            </label>
                          );
                        })}
                      </div>

                      <button className="px-10 float-right py-2 bg-[#5B5B5B] rounded-lg font-medium border border-transparent text-white hover:text-black text-lg hover:border-black hover:bg-white transition duration-200 -translate-y-4">
                        Filter
                      </button>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
          <p className="mb-4 mx-2">
            {
              "Conway produces high quality gripper bars and related products that are interchangeable with the original manufacturer's product but at better price."
            }
          </p>
          <div className="h-[720px] overflow-y-scroll ">
            <Link href="/product/product_id">
              <ProductCardExtended />
              <ProductCardExtended />
              <ProductCardExtended />
              <ProductCardExtended />
            </Link>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
