/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { use, useState } from "react";
import Image from "next/image";
import Button from "@/app/components/Button";
import FeatureTag from "@/app/components/dashboard/FeatureTag";
import InputField from "@/app/components/Input";
import Tag from "@/app/components/Tag";
import TextareaField from "@/app/components/Textarea";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetDiscountsQuery,
  useCreateDiscountMutation,
  useGetBadgesQuery,
  useCreateBadgeMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteReviewMutation,
} from "@/redux";
import VariantGroupModal from "@/app/components/dashboard/products/VariantGroupModal";
import ColorPickerModal from "@/app/components/dashboard/products/ColorPickerModal";

const MAX_IMAGE_SIZE_MB = 5;

const DEFAULT_COLORS = [
  { id: "yellow", name: "Yellow", hex: "#F4C542" },
  { id: "red", name: "Red", hex: "#E14848" },
  { id: "green", name: "Green", hex: "#3EAE5A" },
  { id: "blue", name: "Blue", hex: "#3E6BF0" },
];

const DEFAULT_RAM_OPTIONS = [
  { id: "8gb", name: "8GB", priceAdjustment: 0 },
  { id: "16gb", name: "16GB", priceAdjustment: 500 },
  { id: "64gb", name: "64GB", priceAdjustment: 1000 },
];

const DEFAULT_STORAGE_OPTIONS = [
  { id: "128gb", name: "128GB", priceAdjustment: 0 },
  { id: "512gb", name: "512GB", priceAdjustment: 800 },
  { id: "1tb", name: "1TB", priceAdjustment: 1000 },
];

const DEFAULT_PROCESSOR_OPTIONS = [
  { id: "i5", name: "Core i5", priceAdjustment: 0 },
  { id: "i7", name: "Core i7", priceAdjustment: 700 },
  { id: "i9", name: "Core i9", priceAdjustment: 1000 },
];

function VariantSection({ label, options, selectedIds, onToggle, onEdit }) {
  return (
    <div>
      <p className="text-size-h6 uppercase tracking-wide mb-space-3 font-primary font-semibold">
        {label}:
      </p>
      <div className="flex gap-3 flex-wrap items-center">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Manage ${label} options`}
          className="h-16.25 w-16.25 flex items-center justify-center rounded-sm border-2 border-dashed border-secondary text-secondary shrink-0"
        >
          <i className="fi fi-rr-edit text-size-h5"></i>
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onToggle(option.id)}
            className={`rounded-sm border min-w-25 h-16.25 p-space-3 text-size-h6 font-primary font-semibold transition-colors text-center ${
              selectedIds.includes(option.id)
                ? "border-secondary bg-secondary/5 text-secondary"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/5"
            }`}
          >
            <p className="font-semibold">{option.name}</p>
            {option.priceAdjustment > 0 && (
              <p className="text-size-medium text-placeholder_2/80">
                + ${option.priceAdjustment}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Matches a saved item (from the product) against the default option list by
// name — if it's a known default, mark that default selected; otherwise add
// it as a new option (using its real backend _id) and select that instead.
function mergeWithDefaults(defaults, savedItems, mapSaved) {
  const options = [...defaults];
  const selectedIds = [];

  savedItems.forEach((saved) => {
    const mapped = mapSaved(saved);
    const existing = options.find(
      (o) => o.name.toLowerCase() === mapped.name.toLowerCase(),
    );
    if (existing) {
      selectedIds.push(existing.id);
    } else {
      options.push(mapped);
      selectedIds.push(mapped.id);
    }
  });

  return { options, selectedIds };
}

const Page = ({ params }) => {
  const router = useRouter();
  const { id: productId } = use(params); // Next.js 15: params is a Promise

  const { data, isLoading } = useGetProductByIdQuery({ id: productId });
  const product = data?.data?.product;
  const reviews = data?.data?.reviews || [];

  // ---------- Basic fields ----------
  const [form, setForm] = useState(null); // stays null until pre-filled from the fetched product
  const handleFieldChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ---------- Colors ----------
  const [colorOptions, setColorOptions] = useState(DEFAULT_COLORS);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showColorModal, setShowColorModal] = useState(false);

  const toggleColor = (id) =>
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  const handleAddColor = (color) => setColorOptions((prev) => [...prev, color]);

  // ---------- Variant groups ----------
  const [ramOptions, setRamOptions] = useState(DEFAULT_RAM_OPTIONS);
  const [storageOptions, setStorageOptions] = useState(DEFAULT_STORAGE_OPTIONS);
  const [processorOptions, setProcessorOptions] = useState(
    DEFAULT_PROCESSOR_OPTIONS,
  );
  const [selectedRamIds, setSelectedRamIds] = useState([]);
  const [selectedStorageIds, setSelectedStorageIds] = useState([]);
  const [selectedProcessorIds, setSelectedProcessorIds] = useState([]);

  const toggleInArray = (id, setter) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const [editingGroup, setEditingGroup] = useState(null);

  const GROUP_CONFIG = {
    RAM: { options: ramOptions, setOptions: setRamOptions },
    Storage: { options: storageOptions, setOptions: setStorageOptions },
    Processor: { options: processorOptions, setOptions: setProcessorOptions },
  };

  // ---------- Features / Specifications ----------
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const handleAddFeature = () => {
    const value = featureInput.trim();
    if (!value) return;
    setFeatures((prev) => [...prev, value]);
    setFeatureInput("");
  };
  const handleRemoveFeature = (index) =>
    setFeatures((prev) => prev.filter((_, i) => i !== index));

  // ---------- Images: existing (already on the product) + newly added ----------
  const [existingImages, setExistingImages] = useState([]); // [{ _id, url }]
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];

    for (const file of files) {
      const isAllowedType = ["image/png", "image/jpeg", "image/jpg"].includes(
        file.type,
      );
      const isAllowedSize = file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024;

      if (!isAllowedType) {
        toast.error(`${file.name}: only PNG or JPG images are allowed.`);
        continue;
      }
      if (!isAllowedSize) {
        toast.error(`${file.name}: must be under ${MAX_IMAGE_SIZE_MB}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [
      ...prev,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const handleRemoveNewImage = (index) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
  };

  // ---------- Discount tags ----------
  const { data: discountsData } = useGetDiscountsQuery();
  const [createDiscount, { isLoading: creatingDiscount }] =
    useCreateDiscountMutation();
  const discounts = discountsData?.data || [];

  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [newDiscountValue, setNewDiscountValue] = useState("");

  const handleCreateDiscount = async () => {
    const value = Number(newDiscountValue);
    if (!value || value <= 0 || value > 100) {
      toast.error("Enter a valid discount percentage (1–100).");
      return;
    }
    try {
      const res = await createDiscount(value).unwrap();
      setSelectedDiscount(res.data.percentage);
      setNewDiscountValue("");
      setShowAddDiscount(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not create discount tag.");
    }
  };

  // ---------- Badges ----------
  const { data: badgesData } = useGetBadgesQuery();
  const [createBadge, { isLoading: creatingBadge }] = useCreateBadgeMutation();
  const badges = badgesData?.data || [];

  const [selectedBadges, setSelectedBadges] = useState([]);
  const [showAddBadge, setShowAddBadge] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState("");

  const toggleBadge = (id) =>
    setSelectedBadges((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );

  const handleCreateBadge = async () => {
    const name = newBadgeName.trim();
    if (!name) return;
    try {
      const res = await createBadge(name).unwrap();
      setSelectedBadges((prev) => [...prev, res.data._id]);
      setNewBadgeName("");
      setShowAddBadge(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not create badge.");
    }
  };

  // ---------- Brand / Category ----------
  const { data: brandsData } = useGetBrandsQuery();
  const [createBrand] = useCreateBrandMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();

  const resolveBrandId = async (name) => {
    const existing = (brandsData?.data || []).find(
      (b) => b.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (existing) return existing._id;
    const res = await createBrand({ name: name.trim() }).unwrap();
    return res.data._id;
  };

  const resolveCategoryId = async (name) => {
    const existing = (categoriesData?.data || []).find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (existing) return existing._id;
    const res = await createCategory({ name: name.trim() }).unwrap();
    return res.data._id;
  };

  // ---------- Pre-fill everything once the product loads ----------
  // Render-time state adjustment (guarded, runs once per productId) — same
  // pattern used on the customer Product Details page, avoids an extra
  // effect-triggered render pass.
  const [syncedProductId, setSyncedProductId] = useState(null);

  if (product && productId !== syncedProductId) {
    setSyncedProductId(productId);

    setForm({
      title: product.title,
      brand: product.brand?.name || "",
      category: product.category?.name || "",
      description: product.description,
      startingPrice: String(product.startingPrice),
      stock: String(product.stock),
    });

    setExistingImages(product.images || []);
    setRemovedImageIds([]);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);

    setFeatures(product.specifications || []);
    setSelectedDiscount(product.discountPercentage || null);
    setSelectedBadges((product.badges || []).map((b) => b._id));

    const colorMerge = mergeWithDefaults(
      DEFAULT_COLORS,
      product.colors || [],
      (c) => ({
        id: c._id,
        name: c.name,
        hex: c.hexCode,
      }),
    );
    setColorOptions(colorMerge.options);
    setSelectedColors(colorMerge.selectedIds);

    const productVariants = product.variants || [];
    const ramMerge = mergeWithDefaults(
      DEFAULT_RAM_OPTIONS,
      productVariants.filter((v) => v.group === "RAM"),
      (v) => ({ id: v._id, name: v.name, priceAdjustment: v.priceAdjustment }),
    );
    setRamOptions(ramMerge.options);
    setSelectedRamIds(ramMerge.selectedIds);

    const storageMerge = mergeWithDefaults(
      DEFAULT_STORAGE_OPTIONS,
      productVariants.filter((v) => v.group === "Storage"),
      (v) => ({ id: v._id, name: v.name, priceAdjustment: v.priceAdjustment }),
    );
    setStorageOptions(storageMerge.options);
    setSelectedStorageIds(storageMerge.selectedIds);

    const processorMerge = mergeWithDefaults(
      DEFAULT_PROCESSOR_OPTIONS,
      productVariants.filter((v) => v.group === "Processor"),
      (v) => ({ id: v._id, name: v.name, priceAdjustment: v.priceAdjustment }),
    );
    setProcessorOptions(processorMerge.options);
    setSelectedProcessorIds(processorMerge.selectedIds);
  }

  // ---------- Submit ----------
  const [updateProduct, { isLoading: submitting }] = useUpdateProductMutation();
  const [deleteReview, { isLoading: deletingReview }] =
    useDeleteReviewMutation();

  const buildVariants = () => {
    const variants = [];
    ramOptions
      .filter((o) => selectedRamIds.includes(o.id))
      .forEach((o) =>
        variants.push({
          name: o.name,
          group: "RAM",
          priceAdjustment: o.priceAdjustment,
        }),
      );
    storageOptions
      .filter((o) => selectedStorageIds.includes(o.id))
      .forEach((o) =>
        variants.push({
          name: o.name,
          group: "Storage",
          priceAdjustment: o.priceAdjustment,
        }),
      );
    processorOptions
      .filter((o) => selectedProcessorIds.includes(o.id))
      .forEach((o) =>
        variants.push({
          name: o.name,
          group: "Processor",
          priceAdjustment: o.priceAdjustment,
        }),
      );
    return variants;
  };

  const handleSubmit = async () => {
    if (
      !form.title.trim() ||
      !form.brand.trim() ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      toast.error(
        "Please fill in Product Title, Brand, Category, and Description.",
      );
      return;
    }
    if (!form.startingPrice || Number(form.startingPrice) <= 0) {
      toast.error("Please enter a valid starting price.");
      return;
    }
    if (existingImages.length === 0 && imageFiles.length === 0) {
      toast.error("Please keep or upload at least one product image.");
      return;
    }

    try {
      const [brandId, categoryId] = await Promise.all([
        resolveBrandId(form.brand),
        resolveCategoryId(form.category),
      ]);

      const colorPayload = selectedColors.map((id) => {
        const c = colorOptions.find((x) => x.id === id);
        return { name: c.name, hexCode: c.hex };
      });

      await updateProduct({
        id: productId,
        title: form.title,
        description: form.description,
        brand: brandId,
        category: categoryId,
        variants: buildVariants(),
        colors: colorPayload,
        specifications: features,
        startingPrice: Number(form.startingPrice),
        discountPercentage: selectedDiscount || 0,
        badges: selectedBadges,
        stock: Number(form.stock) || 0,
        images: imageFiles, // newly added images (appended)
        removeImageIds: removedImageIds, // existing images the admin removed
      }).unwrap();

      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(
        err?.data?.message ||
          "Something went wrong while updating the product.",
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete review.");
    }
  };

  if (isLoading || !form) {
    return (
      <section className="px-space-6 pb-space-6 pt-space-3">
        <p className="text-placeholder_2">Loading product...</p>
      </section>
    );
  }

  return (
    <section className="px-space-6 pb-space-6 pt-space-3">
      <div className="p-space-6 space-y-space-7 rounded-2xl bg-[#1A1E3D]/50">
        <Button
          variant="text"
          showLeftIcon
          leftIcon="fi fi-rr-arrow-small-left"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <h1 className="font-semibold text-[20px] text-placeholder_3 ">
          Edit Product
        </h1>

        <div className="flex gap-space-6 *:p-space-4 *:rounded-lg *:flex-1 *:bg-[#1A1E3D]/50 *:space-y-space-9">
          {/* product informations */}
          <div className="*:space-y-space-6 ">
            {/* Basic Information */}
            <div className="">
              <h2 className="font-medium text-size-h6 text-placeholder_3">
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-x-space-7 gap-y-space-8">
                <div className="col-span-2">
                  <InputField
                    title="Product Title"
                    placeholder="e.g. NovaTech X15 Pro Gaming Laptop"
                    required
                    value={form.title}
                    onChange={handleFieldChange("title")}
                  />
                </div>
                <InputField
                  title="Brand"
                  placeholder="e.g. NovaTech"
                  required
                  value={form.brand}
                  onChange={handleFieldChange("brand")}
                />
                <InputField
                  title="Product Category"
                  placeholder="e.g. Gaming Laptop"
                  required
                  value={form.category}
                  onChange={handleFieldChange("category")}
                />
                <div className="col-span-2">
                  <TextareaField
                    title="Product Description"
                    required
                    value={form.description}
                    onChange={handleFieldChange("description")}
                  />
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="">
              <div className="flex items-center gap-space-4">
                <h2 className="font-medium text-size-h6 text-placeholder_3">
                  Product Variants
                </h2>
                <div className="flex gap-1.5 text-secondary font-medium text-size-medium">
                  <i className="fi fi-rr-info text-size-large"></i>
                  You can select multiple variants
                </div>
              </div>
              <div className="space-y-space-9">
                <div>
                  <p className="text-size-h6 uppercase tracking-wide mb-space-3 font-primary font-semibold">
                    Colors:
                  </p>
                  <div className="flex gap-6 items-center flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowColorModal(true)}
                      aria-label="Add a new color"
                      className="h-[32px] w-7 rounded-xs border-2 border-dashed border-secondary text-secondary flex items-center justify-center shrink-0"
                    >
                      <i className="fi fi-rr-plus-small text-size-large"></i>
                    </button>
                    {colorOptions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={c.name}
                        onClick={() => toggleColor(c.id)}
                        style={{ backgroundColor: c.hex }}
                        className={`h-[32px] w-7 rounded-xs outline-2 outline-offset-4 transition-transform cursor-pointer ${
                          selectedColors.includes(c.id)
                            ? "scale-110 outline-cyan-400"
                            : "outline-white/20 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <VariantSection
                  label="RAM"
                  options={ramOptions}
                  selectedIds={selectedRamIds}
                  onToggle={(id) => toggleInArray(id, setSelectedRamIds)}
                  onEdit={() => setEditingGroup("RAM")}
                />
                <VariantSection
                  label="Storage"
                  options={storageOptions}
                  selectedIds={selectedStorageIds}
                  onToggle={(id) => toggleInArray(id, setSelectedStorageIds)}
                  onEdit={() => setEditingGroup("Storage")}
                />
                <VariantSection
                  label="Processor"
                  options={processorOptions}
                  selectedIds={selectedProcessorIds}
                  onToggle={(id) => toggleInArray(id, setSelectedProcessorIds)}
                  onEdit={() => setEditingGroup("Processor")}
                />
              </div>
            </div>
          </div>

          {/* key informations */}
          <div className="">
            {/* images: existing + newly added, in one row */}
            <div className="flex gap-space-3">
              <label className="min-w-37.5 min-h-space-12 flex flex-col items-center justify-center gap-space-1 rounded-lg bg-secondary/10 border-2 border-dashed border-secondary/50 cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
                <div className="flex items-center justify-center size-7 rounded-lg bg-secondary/10 text-secondary text-[24px]">
                  <i className="fi fi-rr-plus-small"></i>
                </div>
                <h6 className="font-semibold text-size-medium text-secondary">
                  Upload Image
                </h6>
                <p className="font-semibold text-[8px] text-placeholder_2">
                  PNG or JPG, up to {MAX_IMAGE_SIZE_MB}MB
                </p>
              </label>
              <div className="flex items-center gap-space-3 w-full overflow-x-auto">
                {existingImages.map((img) => (
                  <div key={img._id} className="relative shrink-0">
                    <Image
                      src={img.url}
                      alt="product"
                      width={150}
                      height={120}
                      className="w-[150px] h-[120px] rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img._id)}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`upload-preview-${i}`}
                      className="w-[150px] h-[120px] rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* pricing and stock */}
            <div className="flex items-center gap-space-7 w-full *:w-full">
              <InputField
                title="Started Price"
                required
                value={form.startingPrice}
                onChange={handleFieldChange("startingPrice")}
                type="number"
                name={"startingPrice"}
              />
              <InputField
                title="Available Stock"
                value={form.stock}
                onChange={handleFieldChange("stock")}
                type="number"
                name={"stock"}
              />
            </div>

            {/* Discount tags */}
            <div className="">
              <label className="font-semibold font-primary text-size-h6 text-foreground ">
                Discount
              </label>
              <div className="flex items-center gap-space-3 mt-space-3 flex-wrap">
                <button
                  type="button"
                  aria-label="add-discount"
                  onClick={() => setShowAddDiscount((prev) => !prev)}
                  className="w-12.5 min-h-[40px] flex items-center justify-center text-[20px] border border-dashed border-secondary text-secondary rounded-lg"
                >
                  <i className="fi fi-rr-edit"></i>
                </button>
                <div className="flex gap-space-3 flex-wrap">
                  {discounts.map((d) => (
                    <button
                      key={d._id}
                      type="button"
                      onClick={() => setSelectedDiscount(d.percentage)}
                      className={
                        selectedDiscount === d.percentage
                          ? "ring-2 ring-secondary rounded-lg"
                          : ""
                      }
                    >
                      <Tag
                        text={`${d.percentage}%`}
                        isIcon
                        icon="fi fi-sr-badge-percent"
                      />
                    </button>
                  ))}
                </div>
              </div>
              {showAddDiscount && (
                <div className="flex items-center gap-space-3 mt-space-3">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-24 rounded-lg border border-white/10 bg-[#12141c] px-3 py-2 text-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCreateDiscount}
                    disabled={creatingDiscount}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="">
              <label className="font-semibold font-primary text-size-h6 text-foreground ">
                Badges
              </label>
              <div className="flex items-center gap-space-3 mt-space-3 flex-wrap">
                <button
                  type="button"
                  aria-label="add-badge"
                  onClick={() => setShowAddBadge((prev) => !prev)}
                  className="w-12.5 min-h-[40px] flex items-center justify-center text-[20px] border border-dashed border-secondary text-secondary rounded-lg"
                >
                  <i className="fi fi-rr-edit"></i>
                </button>
                <div className="flex gap-space-3 flex-wrap">
                  {badges.map((b) => (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => toggleBadge(b._id)}
                      className={
                        selectedBadges.includes(b._id)
                          ? "ring-2 ring-secondary rounded-lg"
                          : ""
                      }
                    >
                      <Tag text={b.name} isIcon icon="fi fi-sr-trophy-star" />
                    </button>
                  ))}
                </div>
              </div>
              {showAddBadge && (
                <div className="flex items-center gap-space-3 mt-space-3">
                  <input
                    value={newBadgeName}
                    onChange={(e) => setNewBadgeName(e.target.value)}
                    placeholder="e.g. International Best Seller"
                    className="rounded-lg border border-white/10 bg-[#12141c] px-3 py-2 text-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCreateBadge}
                    disabled={creatingBadge}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <h2 className="font-medium text-size-h6 text-placeholder_3">
                Features
              </h2>
              <div className="px-space-3 space-y-space-6">
                <div className="flex items-end gap-space-2 ">
                  <InputField
                    showInfo={true}
                    infoMessage="You can add multiple features"
                    title="Feature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-size-large mb-space-7"
                    onClick={handleAddFeature}
                  >
                    Add Feature
                  </Button>
                </div>
                <div className="flex w-full flex-wrap gap-space-3">
                  {features.map((feature, i) => (
                    <FeatureTag
                      key={i}
                      text={feature}
                      onRemove={() => handleRemoveFeature(i)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-space-6"
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews — deletable from here only */}
      {reviews.length > 0 && (
        <div className="p-space-6 rounded-2xl bg-[#1A1E3D]/50 mt-space-6">
          <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-6">
            Customer Reviews{" "}
            <span className="text-secondary">({reviews.length})</span>
          </h2>
          <div className="grid grid-cols-2 gap-space-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="relative p-space-4 rounded-lg bg-background border border-secondary/10"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteReview(r._id)}
                  disabled={deletingReview}
                  aria-label="Delete review"
                  className="absolute top-space-3 right-space-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  <i className="fi fi-rr-cross-small"></i>
                </button>

                <div className="flex items-center gap-space-3 mb-space-3 pr-space-7">
                  <Image
                    src={r.customer?.image?.url || "/placeholder-avatar.png"}
                    alt={r.customer?.name || "Customer"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover size-10"
                  />
                  <div>
                    <p className="font-semibold text-size-h6">
                      {r.customer?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-placeholder_2">
                      {r.customer?.address?.city}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-placeholder_2 shrink-0">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-space-2">
                  <i className="fi fi-sr-star text-secondary text-sm"></i>
                  <span className="text-sm font-medium">{r.rating}</span>
                </div>

                <p className="text-size-large text-placeholder_3">{r.text}</p>

                {r.images?.length > 0 && (
                  <div className="flex gap-space-2 mt-space-3">
                    {r.images.map((img, i) => (
                      <Image
                        key={i}
                        src={img.url}
                        alt="review attachment"
                        width={60}
                        height={60}
                        className="rounded-lg object-cover size-15"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showColorModal && (
        <ColorPickerModal
          onAdd={handleAddColor}
          onClose={() => setShowColorModal(false)}
        />
      )}

      {editingGroup && (
        <VariantGroupModal
          groupName={editingGroup}
          initialOptions={GROUP_CONFIG[editingGroup].options}
          onSave={(nextOptions) =>
            GROUP_CONFIG[editingGroup].setOptions(nextOptions)
          }
          onClose={() => setEditingGroup(null)}
        />
      )}
    </section>
  );
};

export default Page;
