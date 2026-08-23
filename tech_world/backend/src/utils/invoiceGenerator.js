const PDFDocument = require("pdfkit");

/**
 * Streams a PDF invoice for the given order directly to the HTTP response.
 * @param {import('express').Response} res
 * @param {Object} order - populated order document (plain object)
 */
const generateInvoicePdf = (res, order) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.orderId}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(20).text("TechWorld — Invoice", { align: "left" });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor("#555").text(`Order ID: ${order.orderId}`);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Payment Status: ${order.paymentStatus}`);
  doc.moveDown();

  doc.fillColor("#000").fontSize(12).text("Delivery Address", { underline: true });
  doc.fontSize(10).fillColor("#333");
  const addr = order.deliveryAddress || {};
  doc.text(
    [addr.apartmentNumber, addr.buildingNumber, addr.roadNumber, addr.locality, addr.area, addr.city, addr.postCode, addr.country]
      .filter(Boolean)
      .join(", ")
  );
  doc.moveDown();

  // Items table header
  doc.fillColor("#000").fontSize(12).text("Items", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10);
  order.items.forEach((item, idx) => {
    const variantText = (item.selectedVariants || []).map((v) => `${v.name}`).join(", ");
    doc.text(
      `${idx + 1}. ${item.productTitle}  |  ${variantText ? "Variant: " + variantText + "  |  " : ""}Color: ${
        item.color || "-"
      }  |  Qty: ${item.quantity}  |  Price: $${item.totalPrice}`
    );
  });
  doc.moveDown();

  // Price summary
  doc.fontSize(12).text("Price Summary", { underline: true });
  doc.fontSize(10);
  doc.text(`Subtotal: $${order.subtotal}`);
  doc.text(`Discount: -$${order.discount}`);
  doc.text(`Shipping Charge: $${order.shippingCharge}`);
  doc.text(`VAT: $${order.vat}`);
  doc.fontSize(12).text(`Total: $${order.total}`, { underline: true });

  doc.moveDown(2);
  doc.fontSize(9).fillColor("#888").text("Thank you for shopping with TechWorld!", { align: "center" });

  doc.end();
};

module.exports = generateInvoicePdf;