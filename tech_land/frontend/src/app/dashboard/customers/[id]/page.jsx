import { assets } from "@/app/assets/assets";
import { orders } from "@/app/assets/data";
import Button from "@/app/components/Button";
import SavedCard from "@/app/components/cart/SavedCard";
import OverallDataCard from "@/app/components/dashboard/home/OverallDataCard";
import OrdersTable from "@/app/components/dashboard/orders/OrderTable";
import Select from "@/app/components/dashboard/Select";
import TableToolbar from "@/app/components/dashboard/TableToolbar";
import SearchBar from "@/app/components/SearchBar";
import Image from "next/image";
import React from "react";

const personalInfo = [
  {
    name: "Email",
    value: "mahdi@gmail.com",
  },
  {
    name: "Phone Number",
    value: "+880 17359 99190",
  },
  {
    name: "Date of Birth",
    value: "30 May, 2006",
  },
  {
    name: "Gender",
    value: "Male",
  },
];

const page = () => {
  return (
    <div className="px-space-6 pb-space-6 mt-space-3">
      <div className="p-space-6 space-y-space-8 rounded-2xl bg-[#1A1E3D]/50">
        <div className="flex items-center justify-between">
          <Button
            variant="text"
            showLeftIcon
            leftIcon="fi fi-rr-arrow-small-left"
          >
            Back
          </Button>
          <Button variant="secondary" color={"#d10000"}>
            Delete Customer
          </Button>
        </div>

        <div className="space-y-space-9 px-space-4">
          {/* image, name and overall informations */}
          <div className="flex items-center justify-between">
            <div className="flex gap-space-3 ">
              <Image
                alt="user"
                src={assets.user_1}
                width={52}
                height={52}
                className="w-13 h-13 object-cover rounded-full mt-space-2"
              />
              <div>
                <h1 className="font-semibold text-[24px] mb-space-1 ">
                  Imran Hossain
                </h1>
                <h2 className="font-medium text-size-medium text-placeholder_3 mb-space-2">
                  CUS-1021
                </h2>
                <p className="font-medium text-size-large text-placeholder_2">
                  Customer since: May 12, 2024.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-6">
              <OverallDataCard />
            </div>
          </div>

          <div className="flex gap-space-8 *:flex-1">
            <div>
              <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-4">
                Personal Information
              </h2>
              <div className="space-y-space-3 p-space-3 bg-[#1A1E3D]/50 rounded-[12px]">
                {personalInfo.map((item, i) => (
                  <div
                    key={i}
                    className="p-space-3 rounded-[8px] odd:bg-secondary/5 even:bg-primary/5 flex items-center justify-between"
                  >
                    <h4 className="font-medium text-size-h6">{item.name}</h4>
                    <p className="font-medium text-size-h6">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="space-y-space-8">
                <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-4">
                  Shipping Address
                </h2>
                <div className="p-space-3 bg-[#1A1E3D]/50 rounded-xl">
                  <div className="space-y-space-3"></div>
                  <button className="px-space-4 py-space-3 gap-space-2 flex items-center mt-space-5 font-primary font-medium text-size-h6 text-secondary bg-secondary/5 rounded-[8px] border-dashed border-[1.5] border-secondary w-full justify-center">
                    <i className="fi fi-br-plus"></i>
                    Add Address
                  </button>
                </div>
              </div>
              <div className="space-y-space-8 mt-space-8">
                <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-4">
                  Card Information
                </h2>
                <div className="p-space-3 bg-[#1A1E3D]/50 rounded-xl">
                  <div className="space-y-space-3">
                    <SavedCard />
                  </div>
                  <button className="px-space-4 py-space-3 gap-space-2 flex items-center mt-space-5 font-primary font-medium text-size-h6 text-secondary bg-secondary/5 rounded-[8px] border-dashed border-[1.5] border-secondary w-full justify-center">
                    <i className="fi fi-br-plus"></i>
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <TableToolbar title={"Order History"}>
          <Select />
          <SearchBar />
        </TableToolbar>
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default page;
