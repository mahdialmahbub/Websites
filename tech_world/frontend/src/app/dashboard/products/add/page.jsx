/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Button from "@/app/components/Button";
import FeatureTag from "@/app/components/dashboard/FeatureTag";
import InputField from "@/app/components/Input";
import Tag from "@/app/components/Tag";
import TextareaField from "@/app/components/Textarea";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  useCreateProductMutation,
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

/**
 * One variant-group section: [edit icon] [option chip] [option chip] ...
 * Multi-select — clicking a chip toggles it in/out of the selection.
 * The edit icon opens the VariantGroupModal to add/remove options for
 * this specific group.
 */
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

const initialFormState = {
  title: "",
  brand: "",
  category: "",
  description: "",
  startingPrice: "",
  stock: "",
};

const page = () => {
  const router = useRouter();

  // ---------- Basic fields ----------
  const [form, setForm] = useState(initialFormState);
  const handleFieldChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ---------- Colors (add-your-own palette, multi-select) ----------
  const [colorOptions, setColorOptions] = useState(DEFAULT_COLORS);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showColorModal, setShowColorModal] = useState(false);

  const toggleColor = (id) =>
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handleAddColor = (color) => {
    setColorOptions((prev) => [...prev, color]);
  };

  // ---------- Variant groups (RAM / Storage / Processor) — editable option lists, multi-select ----------
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

  const [editingGroup, setEditingGroup] = useState(null); // "RAM" | "Storage" | "Processor" | null

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

  // ---------- Images ----------
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

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Discount tags (persisted — reusable on every future product) ----------
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

  // ---------- Submit ----------
  const [createProduct, { isLoading: submitting }] = useCreateProductMutation();

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedColors([]);
    setSelectedRamIds([]);
    setSelectedStorageIds([]);
    setSelectedProcessorIds([]);
    setFeatures([]);
    setFeatureInput("");
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
    setSelectedDiscount(null);
    setSelectedBadges([]);
    // Note: colorOptions/ramOptions/storageOptions/processorOptions are
    // intentionally NOT reset — the admin's added options stay available
    // for the next product they add in this session.
  };

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
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image.");
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

      await createProduct({
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
        images: imageFiles,
      }).unwrap();

      toast.success("Product add successfully");
      resetForm();
    } catch (err) {
      toast.error(
        err?.data?.message || "Something went wrong while adding the product.",
      );
    }
  };

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
          Add New Product
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
                    placeholder="The NovaTech X15 Pro is a high-performance gaming laptop built with a powerful processor, dedicated graphics, and an ultra-smooth display — ideal for gaming, streaming, and heavy multitasking."
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
                {/* color */}
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
          </div>

          {/* key informations */}
          <div className="">
            {/* images */}
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
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`upload-preview-${i}`}
                      className="w-37.5 h-space-12 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
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
                          ? "ring-2 ring-secondary rounded-full"
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
                          ? "ring-2 ring-secondary rounded-full"
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

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-space-6"
            >
              {submitting ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </div>
      </div>

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

export default page;
