/* eslint-disable prettier/prettier */
import CategoryCard from '@/components/CategoryCard';
import HomeLayout from '@/layouts/HomeLayout';
import {Dialog, Popover, Transition} from '@headlessui/react';
import Image from 'next/image';
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
      <div>
        <div className="mx-2">
          <div className="flex justify-between items-center relative">
            <h4 className="mt-6 pb-6 font-medium">{name}</h4>
            <div className="mt-5"></div>
            <Popover className="">
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
          <p className="mb-4">
            {
              "Conway produces high quality gripper bars and related products that are interchangeable with the original manufacturer's product but at better price."
            }
          </p>
        </div>
        <div className="h-[720px] overflow-y-scroll ">
          <CategoryCard />
        </div>
      </div>
      <Transition appear show={filterModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center relative">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md bg-white pt-4 px-8 text-left align-middle shadow-xl transition-all">
                  <div className="absolute inline-block right-5 top-5">
                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={closeModal}
                      className={'focus:outline-none'}
                    >
                      <Image
                        src="/icons/times.svg"
                        height={16}
                        width={16}
                        alt={'Close Modal'}
                        className={'select-none'}
                      />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </HomeLayout>
  );
}
