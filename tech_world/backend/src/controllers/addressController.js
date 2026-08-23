const Address = require("../models/Address");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ customer: req.customer._id }).sort({ isDefault: -1, createdAt: -1 });
  res.status(200).json(new ApiResponse(200, addresses, "Addresses fetched."));
});

const addAddress = asyncHandler(async (req, res) => {
  const { apartmentNumber, buildingNumber, roadNumber, locality, area, city, postCode, country, isDefault } =
    req.body;

  if (isDefault) {
    await Address.updateMany({ customer: req.customer._id }, { isDefault: false });
  }

  const address = await Address.create({
    customer: req.customer._id,
    apartmentNumber,
    buildingNumber,
    roadNumber,
    locality,
    area,
    city,
    postCode,
    country,
    isDefault: !!isDefault,
  });

  res.status(201).json(new ApiResponse(201, address, "Address added."));
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.addressId, customer: req.customer._id });
  if (!address) throw new ApiError(404, "Address not found.");

  if (req.body.isDefault) {
    await Address.updateMany({ customer: req.customer._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  res.status(200).json(new ApiResponse(200, address, "Address updated."));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.addressId, customer: req.customer._id });
  if (!address) throw new ApiError(404, "Address not found.");
  res.status(200).json(new ApiResponse(200, null, "Address deleted."));
});

module.exports = { getMyAddresses, addAddress, updateAddress, deleteAddress };
