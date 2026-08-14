import React from 'react'
import { Breadcrumb } from '../components/Breadcrumb'
import Chips from '../components/Chips'
import { ProductCard } from '../components/ProductCard'
import SearchBar from '../components/SearchBar'

const page = () => {
  return (
    <section>
        <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My orders" }, // last item — no href, highlighted
          ]}
        />
      </div>
      <div className='px-space-11'>
        <div className="flex items-center gap-space-5 mb-space-7">
            <div className="flex items-center gap-space-4">
              <i className="fi fi-rr-order-history text-[30px] text-secondary"></i>
              <h1 className="font-primary font-semibold text-size-h4">
                Pending Orders
              </h1>
            </div>
            <Chips text={"03"} />
          </div>
          <div className='flex gap-space-6 mb-space-8'>
            <ProductCard variant='pendingOrder'/>
          </div>
          <div className='flex items-center justify-between mb-space-7'>
                      <div className="flex items-center gap-space-5">
            <div className="flex items-center gap-space-4">
              <i className="fi fi-rr-cart-shopping-fast text-[30px] text-secondary"></i>
              <h1 className="font-primary font-semibold text-size-h4">
                Your Cart Items
              </h1>
            </div>
            <Chips text={"03"} />
          </div>
          <SearchBar placeholder={"Search your needs ..."} />
          </div>
          <div className='space-x-space-6 *:w-full'>
            <ProductCard variant='delivered' />
          </div>
      </div>
    </section>
  )
}

export default page