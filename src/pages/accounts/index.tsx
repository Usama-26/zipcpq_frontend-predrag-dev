import {Button} from '@/components/Button';
import {SelectInput, TextInput} from '@/components/Form';

import HomeLayout from '@/layouts/HomeLayout';
import SidebarAccounts from '@/layouts/components/SidebarAccounts';

const countryOptions = [
  {
    value: 'United States',
    label: 'United States',
  },
  {
    value: 'Canada',
    label: 'Canada',
  },
  {
    value: 'South Africa',
    label: 'South Africa',
  },
];

export default function Accounts() {
  return (
    <HomeLayout>
      <>
        <SidebarAccounts />
        <div className="h-[700px]">
          <div className="mb-7">
            <h1>
              <span className="font-bold text-xl text-zinc-700 border-r border-r-zinc-700 pr-2">
                My Account
              </span>
              <span className="text-yellow-700 ml-4"> Hello, Emma Smith</span>
            </h1>
          </div>
          <div className="flex gap-8 rounded-md border text-black border-[#c0c0c0] p-10  h-[550px] overflow-auto">
            <div className="2xl:basis-1/5 basis-2/5 self-start">
              <h2 className="text-xl font-bold">Account Details</h2>
              <p className="text-sm">
                Change your name, email, mobile number and more.
              </p>
            </div>
            <div className="self-end basis-full flex justify-center">
              <form action="" className="mx-auto flex flex-col gap-4 p-10 pb-0">
                <div className="flex gap-8">
                  {' '}
                  <label htmlFor="firstName">
                    <span className="font-bold text-sm">
                      First Name <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="first_name"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                  <label htmlFor="lastName">
                    <span className="font-bold text-sm">
                      Last Name <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="last_name"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                </div>
                <div className="flex gap-8">
                  {' '}
                  <label htmlFor="email">
                    <span className="font-bold text-sm">
                      Email <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="first_name"
                      type="email"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                  <label htmlFor="phone">
                    <span className="font-bold text-sm">
                      Phone <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="phone"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                </div>

                <div className="flex gap-8">
                  {' '}
                  <label htmlFor="streetAddress">
                    <span className="font-bold text-sm">
                      Street Address <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="street_address"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                  <label htmlFor="addressLine2">
                    <span className="font-bold text-sm">Address Line 2</span>
                    <TextInput
                      name="address_line_2"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                </div>
                <div className="flex gap-8">
                  {' '}
                  <label htmlFor="city">
                    <span className="font-bold text-sm">
                      City <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="city"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                  <label htmlFor="addressLine2">
                    <span className="font-bold text-sm">
                      State/Province/Region <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="region"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                </div>
                <div className="flex gap-8">
                  {' '}
                  <label htmlFor="zipCode">
                    <span className="font-bold text-sm">
                      ZIP/Postal Code <b className="text-red-500">*</b>
                    </span>
                    <TextInput
                      name="zip_code"
                      className="rounded-md py-1 px-2 border text-zinc-700"
                    />
                  </label>
                  <label htmlFor="country" className="w-full">
                    <span className="font-bold text-sm">Choose Country</span>
                    <SelectInput
                      name="country"
                      className="w-full rounded-md py-1 px-2 border text-zinc-700"
                      options={countryOptions}
                    ></SelectInput>
                  </label>
                </div>
                <span className="text-red-500 text-sm self-end">
                  Required Fields*
                </span>
                <div className="self-end">
                  <Button className="rounded-md mr-2 bg-gray-50 shadow-none text-[#717284] border border-[#c0c0c0] hover:text-white hover:!bg-zinc-700">
                    Cancel
                  </Button>
                  <Button className="rounded-md shadow-none bg-yellow-700 text-black hover:text-white hover:!bg-zinc-700">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </HomeLayout>
  );
}
