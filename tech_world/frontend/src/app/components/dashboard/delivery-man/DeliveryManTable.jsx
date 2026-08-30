// components/dashboard/delivery-man/DeliveryManTable.jsx

import DeliveryManRow from "./DeliveryManRow";

const DeliveryManTable = ({ deliveryMen }) => {
  return (
    <div className="rounded-2xl border-2 border-secondary/10 px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10 *:px-space-3 *:py-space-2">
            <th className="">Name</th>
            <th className="">Email</th>
            <th className="">Vehicle</th>
            <th className="">Status</th>
            <th className="">Deliveries</th>
            <th className="">Joined On</th>
            <th className=" text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveryMen?.map((deliveryMan) => (
            <DeliveryManRow key={deliveryMan._id} deliveryManId={deliveryMan._id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryManTable;
