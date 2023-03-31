/* eslint-disable prettier/prettier */
import HomeLayout from '@/layouts/HomeLayout';
import {Tab} from '@headlessui/react';
import {ChevronRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ProductPage() {
  return (
    <HomeLayout>
      <div className="text-black font-poppins mt-4">
        <div className="flex items-center ">
          <div className="w-7/12">
            <div className="flex">
              <h1 className="font-bold text-xl mr-4">
                <span>Conway Gripper Bar Complete for Bobst SP 900</span>
              </h1>
              <button className="inline-flex items-center gap-2 uppercase  px-5 py-1.5 bg-[#5B5B5B] rounded font-bold border-l border-transparent hover:border-black hover:bg-yellow-700 text-white marker:transition duration-200 text-base">
                <span>Quote Now</span>
                <ChevronRightIcon className="h-3 stroke-2 stroke-white" />
              </button>
            </div>
            <div className="my-8 font-bold">
              <span>CMI # 10-351-0-00-00</span>
              <br />
              <span>Compare to BSA04120000FM</span>
            </div>

            <p className="mb-8 w-4/5">
              Conway Gripper Bar complete for Bobst die cutters SP 900 E and SP
              900 ER. The axles come installed in the end fittings. Contact us
              for a quote. There is another version available for running
              corrugated board. Ask your salesperson about 10-351-1-00-00
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
          <div className="w-5/12 border border-black">
            <img
              src="https://dummyimage.com/675x585/ebebeb/000000.png&text=675x585"
              alt="Product Image"
              className="  mx-auto"
            />
          </div>
        </div>
        <Tab.Group>
          <Tab.List className="flex border-b border-[#BDBDBD]">
            <Tab className="border border-r-0 border-b-0 border-[#BDBDBD] rounded-tl text-center w-72 py-4">
              <span>Related Products</span>
            </Tab>
            <Tab className="border border-l-0 border-b-0 border-[#BDBDBD] rounded-tr text-center w-72 py-4">
              <span>Documentation</span>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2"></Tab.Panels>
        </Tab.Group>
      </div>
    </HomeLayout>
  );
}
