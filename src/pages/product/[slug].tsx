/* eslint-disable @next/next/no-img-element */
/* eslint-disable prettier/prettier */
import ProductCard from '@/components/ProductCard';
import HomeLayout from '@/layouts/HomeLayout';
import {Tab} from '@headlessui/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import {Splide, SplideSlide} from '@splidejs/react-splide';
import dynamic from 'next/dynamic';
import ImageGallery from '../../components/imageGallery';

import '@splidejs/react-splide/css';
import {useState} from 'react';
import {Button} from '@/components/Button';
import categoryModel from 'server/models/categoryModel';
import {TBreadCrumb} from '_types/ui';
import {setLicenseDB} from 'server/db';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';

export default function Index({
  sidebarCategories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [active2d, setActive2d] = useState(true);
  const [active3d, setActive3d] = useState(false);

  const mainImage = '/images/products/gripper-bar.png';
  const thumbnailImages = [
    '/images/products/gear.png',
    '/images/products/brush.png',
    '/images/products/gietz.png',
    '/images/products/plates.png',
    '/images/products/gripper-bar.png',
  ];

  const setActive = () => {
    setActive2d(!active2d);
    setActive3d(!active3d);
  };
  return (
    <HomeLayout
      sidebarCategories={sidebarCategories}
      breadcrumb={[]}
      showSideBar={false}
    >
      <section className="text-black font-poppins mt-4">
        <div className="mb-10 items-center gap-4 grid lg:grid-cols-12 justify-center ">
          <div className="lg:col-span-7 w-full  mb-4 ">
            <div className="flex gap-5">
              <h1 className="font-bold text-[30px] text-start">
                <span>Conway Gripper Bar Complete for Bobst SP 900</span>
              </h1>
              <div>
                <Button
                  onClick={() => setShowProductDetails(!showProductDetails)}
                  className="rounded-md text-[14px] w-[170px] p-0 hover:!bg-yellow-700 hover:!text-black border-transparent focus:outline-none uppercase !bg-[#5B5B5B] focus:ring-0"
                >
                  <span>
                    {showProductDetails ? 'PRODUCT DETAILS' : 'QUOTE NOW'}
                  </span>
                  <ChevronRightIcon className="h-3 stroke-2" />
                </Button>
              </div>
            </div>
            {showProductDetails ? (
              <div className=" my-8">
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
                        <td className="p-2">1</td>
                        <td className="p-2">2</td>
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
                        <th className="p-2 text-center">
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
                <Button
                  disabled
                  className="rounded-md gap-2 hover:!bg-yellow-700 hover:!text-black hover:!border-l-black border-l border-transparent float-right uppercase mt-4 h-8 !py-1 !text-sm !bg-[#5B5B5B] disabled:bg-[#bdbdbd]"
                >
                  <span>Add to RFQ</span>
                </Button>
              </div>
            ) : (
              <div>
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
                  <Button className="rounded-md gap-2 hover:!bg-yellow-700 hover:!text-black hover:!border-l-black border-l border-transparent !font-normal h-8 !py-1 !text-sm !bg-[#5B5B5B]">
                    <span>Find it here</span>
                  </Button>
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-5  w-full mb-12 relative self-start">
            {showProductDetails ? (
              <div className="border border-[#5b5b5b] ">
                <div className="p-4">
                  <Image
                    src="/images/products/gripper-bar.png"
                    alt="Product Image"
                    width={513}
                    height={495}
                    className="mx-auto w-80 h-80 object-cover"
                  />
                </div>
                <div className="absolute right-2 top-10 inline-flex flex-col gap-2">
                  <button>
                    <Image
                      src="/static/imgs/full-screen--v2.png"
                      alt="Product Image"
                      width={500}
                      height={500}
                      className="mx-auto w-7 h-7 object-cover"
                    />
                  </button>
                  <button
                    onClick={setActive}
                    className={` w-7 h-7  ${
                      active3d
                        ? 'bg-yellow-700 hover:bg-yellow-700 text-black'
                        : 'text-white  hover:bg-zinc-900 bg-[#5b5b5b]'
                    }`}
                  >
                    3D
                  </button>
                  <button
                    onClick={setActive}
                    className={` w-7 h-7  ${
                      active2d
                        ? 'bg-yellow-700 hover:bg-yellow-700 text-black'
                        : 'text-white hover:bg-zinc-900 bg-[#5b5b5b]'
                    }`}
                  >
                    2D
                  </button>
                </div>
                <div className=" p-4 translate-y-16 flex justify-center">
                  <Image
                    src="/static/imgs/move.png"
                    alt="Product Image"
                    width={90}
                    height={120}
                    className=" w-16 h-20 object-cover bg-white"
                  />
                  <Image
                    src="/static/imgs/rotate.png"
                    alt="Product Image"
                    width={90}
                    height={120}
                    className=" w-16 h-20 object-cover bg-white"
                  />
                  <Image
                    src="/static/imgs/zoom.png"
                    alt="Product Image"
                    width={90}
                    height={120}
                    className=" w-16 h-20 object-cover bg-white"
                  />
                  <Image
                    src="/static/imgs/select-part.png"
                    alt="Product Image"
                    width={90}
                    height={120}
                    className=" w-16 h-20 object-cover bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="">
                <ImageGallery
                  mainImage={mainImage}
                  thumbnailImages={thumbnailImages}
                />
              </div>
            )}
          </div>
        </div>
        <Tab.Group>
          <Tab.List className="flex lg:justify-start  mt-10 mb-12">
            <Tab>
              {({selected}) => (
                <div
                  className={` border bg-white border-b-transaparent border-[#BDBDBD] rounded-tl text-center w-72 py-4 hover:bg-yellow-700 hover:border ${
                    selected
                      ? 'border border-black border-r-black'
                      : 'border-r-transparent'
                  }`}
                >
                  Related Products
                </div>
              )}
            </Tab>
            <Tab>
              {({selected}) => (
                <div
                  className={` border border-b-transaparent border-[#BDBDBD] rounded-tr text-center w-72   py-4 hover:bg-yellow-700 hover:border' ${
                    selected && 'border border-black'
                  }`}
                >
                  Documentation
                </div>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2 mb-12">
            <Tab.Panel>
              <div id="mySplide">
                <Splide
                  options={{
                    perPage: 4,
                    perMove: 1,
                    gap: '2rem',
                    pagination: false,
                  }}
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
                  <SplideSlide>
                    <ProductCard />
                  </SplideSlide>
                </Splide>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-sm h-44 font-medium">
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
              <div>
                <img src="/images/logo.png" alt="" className="opacity-50" />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
    </HomeLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, req}) => {
  const {slug} = query;
  if (!(await setLicenseDB(req.headers.host))) {
    return {
      notFound: true,
    };
  }
  const breadcrumb: TBreadCrumb[] = [
    {
      title: 'Product',
      url: '/',
    },
  ];

  return {
    props: {
      sidebarCategories: await categoryModel.getCategoriesHierarchy({}),
      breadcrumb,
    },
  };
};
