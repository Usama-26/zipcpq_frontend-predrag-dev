/* eslint-disable prettier/prettier */
import ProductCard from '@/components/ProductCard';
import HomeLayout from '@/layouts/HomeLayout';
import {Tab} from '@headlessui/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import {Splide, SplideSlide} from '@splidejs/react-splide';

import '@splidejs/react-splide/css';
import {useState} from 'react';

export default function ProductPage() {
  const [toggleProductDetails, setToggleProductDetails] = useState(true);
  console.log(toggleProductDetails);

  return (
    <HomeLayout>
      <div className="text-black font-poppins mt-4">
        <div className="flex items-center ">
          <div className="w-7/12">
            <div className="flex">
              <h1 className="font-bold text-xl mr-4">
                <span>Conway Gripper Bar Complete for Bobst SP 900</span>
              </h1>
              <button
                onClick={() => setToggleProductDetails(!toggleProductDetails)}
                className="inline-flex items-center gap-2 uppercase  px-5 py-1.5 bg-[#5B5B5B] rounded font-bold border-l border-transparent hover:border-black hover:bg-yellow-700 text-white marker:transition duration-200 text-base"
              >
                <span>
                  {toggleProductDetails ? 'Product Details' : 'Get Quote'}
                </span>
                <ChevronRightIcon className="h-3 stroke-2 stroke-white" />
              </button>
            </div>
            {toggleProductDetails ? (
              <div className="h-[480px] my-8 pr-8">
                <div className="overflow-x-auto w-full">
                  <table className="table w-full text-sm">
                    {/* head */}
                    <thead>
                      <tr className="uppercase">
                        <th className="p-2"></th>
                        <th className="p-2">Item No.</th>
                        <th className="p-2">QTY</th>
                        <th className="p-2">CMI Part No.</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">OEM Part No.</th>
                        <th className="p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <td className="p-2 text-center">
                          <input type="checkbox" className="checkbox" />
                        </td>
                        <td className="p-2"></td>
                        <td className="p-2">1</td>
                        <td className="p-2">10-351-0-00-00</td>
                        <td className="p-2">Griper Bar Complete</td>
                        <td className="p-2">BSA04120000FM</td>
                        <td className="p-2">
                          <span>
                            <button>
                              <Image
                                src="/icons/eye-outlined.svg"
                                width={512}
                                height={512}
                                alt="eye icon"
                                className="w-6 h-6 mr-2"
                              />
                            </button>
                            <button>
                              <Image
                                src="/icons/cart.svg"
                                width={512}
                                height={512}
                                alt="cart icon"
                                className="w-6 h-6"
                              />
                            </button>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center">
                          <input type="checkbox" className="checkbox" />
                        </td>
                        <td className="p-2">1</td>
                        <td className="p-2">1</td>
                        <td className="p-2">10-351-0-01-01</td>
                        <td className="p-2">Shell (Assembly)</td>
                        <td className="p-2">BSA04120000FM</td>
                        <td className="p-2">
                          <span>
                            <button>
                              <Image
                                src="/icons/eye-outlined.svg"
                                width={512}
                                height={512}
                                alt="eye icon"
                                className="w-6 h-6 mr-2"
                              />
                            </button>
                            <button>
                              <Image
                                src="/icons/cart.svg"
                                width={512}
                                height={512}
                                alt="cart icon"
                                className="w-6 h-6"
                              />
                            </button>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    {/* foot */}
                    <tfoot className="rounded-none">
                      <tr>
                        <th className="p-2">
                          <input type="checkbox" className="checkbox" />
                        </th>
                        <th className="p-2">Select all items</th>
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-[480px]">
                <div className="my-8 font-bold">
                  <span>CMI # 10-351-0-00-00</span>
                  <br />
                  <span>Compare to BSA04120000FM</span>
                </div>

                <p className="mb-8 w-4/5">
                  Conway Gripper Bar complete for Bobst die cutters SP 900 E and
                  SP 900 ER. The axles come installed in the end fittings.
                  Contact us for a quote. There is another version available for
                  running corrugated board. Ask your salesperson about
                  10-351-1-00-00
                </p>

                <p className="mb-2">
                  Conway Gripper Bar Complete for Bobst SP 900 common uses:
                </p>
                <ul className=" list-disc mb-8">
                  <li className="ml-6">list of uses</li>
                  <li className="ml-6">list of uses</li>
                  <li className="ml-6">list of uses</li>
                </ul>

                <p className="text-lg">
                  <span className="mr-4">Looking for a specific part ?</span>
                  <button className="inline-flex items-center gap-2 px-6 py-1 bg-[#5B5B5B] rounded font-medium border-l border-b border-transparent hover:border-black hover:bg-yellow-700 text-white transition duration-200 text-sm">
                    <span>Find it here</span>
                  </button>
                </p>
              </div>
            )}
          </div>
          <div className="w-5/12 bg-gray-100 self-start">
            <Image
              src="/images/products/gripper-bar.png"
              alt="Product Image"
              width={513}
              height={495}
              className="mx-auto"
            />
          </div>
        </div>
        <Tab.Group>
          <Tab.List className="flex border-b border-[#BDBDBD]">
            <Tab>
              {({selected}) => (
                <div
                  className={`inline-block border border-r-transparent border-b-transaparent border-[#BDBDBD] rounded-tl text-center w-72 py-4 hover:bg-yellow-700 hover:border-black hover:border ${
                    selected &&
                    'border bg-yellow-700 border-black border-r-black'
                  }`}
                >
                  Related Products
                </div>
              )}
            </Tab>
            <Tab>
              {({selected}) => (
                <div
                  className={`'inline-block border border-b-transaparent border-[#BDBDBD] rounded-tr text-center w-72 py-4 hover:bg-yellow-700 hover:border-black hover:border' ${
                    selected && 'border bg-yellow-700 border-black'
                  }`}
                >
                  Documentation
                </div>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <Splide
                options={{perPage: 4, perMove: 1, gap: '1rem'}}
                className="mx-auto"
              >
                <SplideSlide>
                  <ProductCard />
                </SplideSlide>
                <SplideSlide>
                  <ProductCard />
                </SplideSlide>
                <SplideSlide>
                  <ProductCard />
                </SplideSlide>
                <SplideSlide>
                  <ProductCard />
                </SplideSlide>
              </Splide>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-sm h-96 font-medium">
                <p>
                  To find out even more, download our specification document
                  here:
                </p>
                <p>
                  <b>General Literature</b>
                  ...........................................................{' '}
                  <button className="text-blue-700">Download PDF (2.0)</button>
                </p>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </HomeLayout>
  );
}
