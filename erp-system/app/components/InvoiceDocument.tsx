"use client";

export type InvoiceDocumentItem = {
  description: string;
  qty: number;
  rate: number;
  gstRate: number;
  hsnSac?: string;
  unit?: string;
};

export type InvoiceDocumentProps = {
  id?: string;
  className?: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  penaltyAmount?: number;
  sellerDetails: {
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    web?: string;
    bankName?: string;
    bankBranch?: string;
    bankAccountNumber?: string;
    bankIfsc?: string;
    bankUpiId?: string;
  };
  customerDetails: {
    customerName: string;
    companyName: string;
    email: string;
    phone: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    placeOfSupply?: string;
    challanNo?: string;
    challanDate?: string;
    ewayBillNo?: string;
    transport?: string;
    transportId?: string;
  };
  items: InvoiceDocumentItem[];
  showTransportDetails?: boolean;
};

function numberToWords(num: number): string {
  if (num === 0) return "ZERO RUPEES ONLY";

  const a = [
    "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN",
    "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN",
  ];
  const b = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

  function g(n: number): string {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
  }

  function h(n: number): string {
    if (n < 100) return g(n);
    const tenPlace = n % 100;
    return a[Math.floor(n / 100)] + " HUNDRED" + (tenPlace ? " AND " + g(tenPlace) : "");
  }

  function convert(n: number): string {
    if (n < 1000) return h(n);
    if (n < 100000) {
      const hundredPlace = n % 1000;
      return convert(Math.floor(n / 1000)) + " THOUSAND" + (hundredPlace ? " " + convert(hundredPlace) : "");
    }
    if (n < 10000000) {
      const thousandPlace = n % 100000;
      return convert(Math.floor(n / 100000)) + " LAKH" + (thousandPlace ? " " + convert(thousandPlace) : "");
    }
    const lakhPlace = n % 10000000;
    return convert(Math.floor(n / 10000000)) + " CRORE" + (lakhPlace ? " " + convert(lakhPlace) : "");
  }

  const parts = num.toFixed(2).split(".");
  const rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let result = convert(rupees) + " RUPEES";
  if (paise > 0) {
    result += " AND " + convert(paise) + " PAISE";
  }
  result += " ONLY";
  return result;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
};

export default function InvoiceDocument({
  id,
  className = "",
  customerName,
  invoiceNumber,
  invoiceDate,
  penaltyAmount = 0,
  sellerDetails,
  customerDetails,
  items,
  showTransportDetails = false,
}: InvoiceDocumentProps) {
  const visibleItems = items.filter(
    (item) => item.description?.trim() || item.qty > 0 || item.rate > 0
  );

  const subtotal = visibleItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gstTotal = visibleItems.reduce(
    (sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100),
    0
  );
  const rawTotal = subtotal + gstTotal + penaltyAmount;
  const roundedTotal = Math.round(rawTotal);
  const roundOff = roundedTotal - rawTotal;
  const totalQty = visibleItems.reduce((sum, item) => sum + item.qty, 0);

  const invoiceDateText = formatDate(invoiceDate);

  const sellerAddress = [sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
    .filter(Boolean)
    .join(", ");
  const customerAddress = [customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.postalCode]
    .filter(Boolean)
    .join(", ");

  const billToName = customerName || customerDetails.customerName || customerDetails.companyName || "—";
  const displayCompany = customerDetails.companyName || billToName;

  return (
    <div
      id={id}
      className={`w-[794px] h-[1123px] max-w-full bg-white text-black p-5 font-sans border-2 border-black text-[11px] leading-tight flex flex-col box-border ${className}`}
    >
      <div className="grid grid-cols-12 gap-3 items-start pb-3">
        <div className="col-span-7 min-w-0 space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-950 font-serif leading-tight break-words">
            {sellerDetails.businessName || "—"}
          </h1>
          {sellerDetails.contactName ? (
            <div className="bg-[#008ba3] text-white text-[9px] font-bold py-1 px-2 uppercase tracking-wide inline-block leading-snug max-w-full break-words">
              {sellerDetails.contactName}
            </div>
          ) : null}
          <p className="text-[10px] text-slate-800 pt-1 break-words">{sellerAddress || "—"}</p>
        </div>

        <div className="col-span-5 min-w-0 flex flex-col items-end text-right">
          <div className="w-full space-y-0.5 text-[10px] text-slate-800 mb-2">
            <p>
              <span className="font-semibold text-slate-700">Tel:</span> {sellerDetails.phone || "—"}
            </p>
            {sellerDetails.web ? (
              <p className="break-all">
                <span className="font-semibold text-slate-700">Web:</span> {sellerDetails.web}
              </p>
            ) : null}
            {sellerDetails.email ? (
              <p className="break-all">
                <span className="font-semibold text-slate-700">Email:</span> {sellerDetails.email}
              </p>
            ) : null}
          </div>

          <div className="mt-1 pt-2 border-t border-slate-300 flex justify-end shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/digital-expansion-logo.png"
              alt="Digital Expansion logo"
              className="h-16 w-auto max-w-[140px] object-contain"
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-black py-1 px-2 grid grid-cols-3 text-xs font-bold items-center gap-2">
        <div className="truncate">PAN : {sellerDetails.panNumber || "—"}</div>
        <div className="text-center text-sm font-black tracking-widest uppercase">TAX INVOICE</div>
        <div className="text-right text-[10px] font-medium tracking-tight">ORIGINAL FOR RECIPIENT</div>
      </div>

      <div className="grid grid-cols-2 border border-black divide-x divide-black mt-1 bg-white">
        <div className="flex flex-col min-w-0">
          <div className="border-b border-black bg-slate-50 font-bold py-1 text-center uppercase text-[10px] tracking-wider">
            Customer Detail
          </div>
          <div className="p-3 space-y-1.5">
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-3 font-bold text-slate-700">M/S</span>
              <span className="col-span-9 font-semibold text-slate-900 break-words">
                {displayCompany}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-3 font-bold text-slate-700">Address</span>
              <span className="col-span-9 text-slate-800 leading-normal break-words">{customerAddress || "—"}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-3 font-bold text-slate-700">Phone</span>
              <span className="col-span-9 text-slate-800">{customerDetails.phone || "—"}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-3 font-bold text-slate-700">GSTIN</span>
              <span className="col-span-9 font-mono font-semibold text-slate-900 break-all">
                {customerDetails.gstNumber || "—"}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-3 font-bold text-slate-700">Place of Supply</span>
              <span className="col-span-9 text-slate-800 break-words">{customerDetails.placeOfSupply || "—"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-600 block leading-none">Invoice No.</span>
              <span className="font-mono text-xs font-bold text-slate-900 break-all">{invoiceNumber || "—"}</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-600 block leading-none">Invoice Date</span>
              <span className="font-semibold text-slate-900">{invoiceDateText}</span>
            </div>
            {showTransportDetails && (
              <>
                <div className="space-y-0.5 border-t border-slate-100 pt-1.5 min-w-0">
                  <span className="text-[10px] font-bold text-slate-600 block leading-none">Transport</span>
                  <span className="text-slate-800 break-words">{customerDetails.transport || "—"}</span>
                </div>
                <div className="space-y-0.5 border-t border-slate-100 pt-1.5 min-w-0">
                  <span className="text-[10px] font-bold text-slate-600 block leading-none">Transport ID</span>
                  <span className="font-mono font-medium break-all">{customerDetails.transportId || "—"}</span>
                </div>
                <div className="col-span-2 space-y-0.5 border-t border-slate-100 pt-1.5 min-w-0">
                  <span className="text-[10px] font-bold text-slate-600 block leading-none">E-Way Bill No.</span>
                  <span className="font-mono text-slate-800 break-all">{customerDetails.ewayBillNo || "—"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex-1 flex flex-col min-h-0">
        <table className="w-full h-full table-fixed border border-black border-collapse text-[10px] leading-tight bg-white flex-1">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[28%]" />
            <col className="w-[10%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[11%]" />
            <col className="w-[5%]" />
            <col className="w-[8%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr className="bg-slate-50 border-b border-black text-center font-bold text-slate-900">
              <th className="border-r border-black p-1">Sr. No.</th>
              <th className="border-r border-black p-1 text-left">Name of Product / Service</th>
              <th className="border-r border-black p-1">HSN / SAC</th>
              <th className="border-r border-black p-1">Qty</th>
              <th className="border-r border-black p-1 text-right">Rate</th>
              <th className="border-r border-black p-1 text-right">Taxable Value</th>
              <th className="border-r border-black p-1" colSpan={2}>
                <div className="border-b border-black pb-0.5 mb-0.5 font-bold">IGST</div>
                <div className="grid grid-cols-2 text-[8px] font-semibold text-slate-600">
                  <span>%</span>
                  <span>Amount</span>
                </div>
              </th>
              <th className="p-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {visibleItems.map((item, index) => {
              const taxable = item.qty * item.rate;
              const gst = taxable * ((item.gstRate ?? 18) / 100);
              const rowTotal = taxable + gst;
              return (
                <tr key={index} className="border-b border-black align-top">
                  <td className="border-r border-black p-1.5 text-center font-mono text-[9px]">{index + 1}</td>
                  <td className="border-r border-black p-1.5 text-left font-medium break-words">{item.description}</td>
                  <td className="border-r border-black p-1.5 text-center font-mono text-[9px] break-all">
                    {item.hsnSac || "—"}
                  </td>
                  <td className="border-r border-black p-1.5 text-center font-mono text-[9px] whitespace-nowrap">
                    {item.qty} {item.unit || "NOS"}
                  </td>
                  <td className="border-r border-black p-1.5 text-right font-mono text-[9px] whitespace-nowrap">
                    ₹{item.rate.toFixed(2)}
                  </td>
                  <td className="border-r border-black p-1.5 text-right font-mono text-[9px] whitespace-nowrap">
                    ₹{taxable.toFixed(2)}
                  </td>
                  <td className="border-r border-black p-1.5 text-center font-mono text-[9px] whitespace-nowrap">
                    {item.gstRate.toFixed(2)}
                  </td>
                  <td className="border-r border-black p-1.5 text-right font-mono text-[9px] whitespace-nowrap">
                    ₹{gst.toFixed(2)}
                  </td>
                  <td className="p-1.5 text-right font-mono text-[9px] font-semibold whitespace-nowrap">
                    ₹{rowTotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {visibleItems.length === 0 && (
              <tr className="border-b border-black">
                <td colSpan={9} className="p-4 text-center text-slate-400 italic h-full">
                  —
                </td>
              </tr>
            )}
            <tr className="bg-slate-50 font-bold text-center text-slate-950">
              <td className="border-r border-black p-1.5 text-right uppercase" colSpan={2}>
                Total
              </td>
              <td className="border-r border-black p-1.5" />
              <td className="border-r border-black p-1.5 font-mono text-[9px] whitespace-nowrap">{totalQty} NOS</td>
              <td className="border-r border-black p-1.5" />
              <td className="border-r border-black p-1.5 text-right font-mono text-[9px] whitespace-nowrap">
                ₹{subtotal.toFixed(2)}
              </td>
              <td className="border-r border-black p-1.5" />
              <td className="border-r border-black p-1.5 text-right font-mono text-[9px] whitespace-nowrap">
                ₹{gstTotal.toFixed(2)}
              </td>
              <td className="p-1.5 text-right font-mono text-[9px] whitespace-nowrap">₹{rawTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-12 border border-black border-t-0 bg-white">
        <div className="col-span-7 flex flex-col divide-y divide-black min-w-0">
          <div className="flex flex-col">
            <div className="bg-slate-50 border-b border-black font-bold py-0.5 text-center text-[9px] uppercase tracking-wider">
              Total in words
            </div>
            <div className="p-2 font-bold text-slate-900 text-center uppercase tracking-normal text-[10px] break-words">
              {numberToWords(roundedTotal)}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-slate-50 border-b border-black font-bold py-0.5 text-center text-[9px] uppercase tracking-wider">
              Bank Details
            </div>
            <div className="p-2 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-8 space-y-1 min-w-0">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-semibold">Name</span>
                  <span className="col-span-8 font-bold text-slate-800 break-words">{sellerDetails.bankName || "—"}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-semibold">Branch</span>
                  <span className="col-span-8 font-semibold text-slate-800 break-words">{sellerDetails.bankBranch || "—"}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-semibold">Acc. Number</span>
                  <span className="col-span-8 font-mono font-semibold text-slate-800 break-all">
                    {sellerDetails.bankAccountNumber || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-semibold">IFSC</span>
                  <span className="col-span-8 font-mono font-semibold text-slate-800 break-all">
                    {sellerDetails.bankIfsc || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 text-slate-500 font-semibold">UPI ID</span>
                  <span className="col-span-8 font-mono font-semibold text-slate-800 break-all">
                    {sellerDetails.bankUpiId || "—"}
                  </span>
                </div>
              </div>
              <div className="col-span-4 flex flex-col items-center justify-center text-center">
                <div className="border border-black p-1 bg-white">
                  <svg className="w-14 h-14 text-black" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="12" y="12" width="11" height="11" fill="black" />
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="77" y="12" width="11" height="11" fill="black" />
                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="12" y="77" width="11" height="11" fill="black" />
                    <rect x="35" y="15" width="8" height="20" fill="black" />
                    <rect x="48" y="5" width="12" height="12" fill="black" />
                    <rect x="40" y="45" width="20" height="8" fill="black" />
                    <rect x="15" y="45" width="12" height="15" fill="black" />
                    <rect x="75" y="45" width="15" height="18" fill="black" />
                    <rect x="45" y="70" width="18" height="15" fill="black" />
                    <rect x="70" y="75" width="20" height="12" fill="black" />
                  </svg>
                </div>
                <span className="text-[7px] font-bold text-slate-800 mt-1 uppercase tracking-tight">Pay using UPI</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-slate-50 border-b border-black font-bold py-0.5 text-center text-[9px] uppercase tracking-wider">
              Terms and Conditions
            </div>
            <div className="p-2 text-[8px] text-slate-700 space-y-0.5 leading-relaxed">
              <p>1. Subject to {sellerDetails.state || "—"} Junction.</p>
              <p>2. Our Responsibility Ceases as soon as goods leaves our Premises.</p>
              <p>3. Goods once sold will not be taken back.</p>
              <p>4. Delivery Ex-Premises.</p>
            </div>
          </div>

          <div className="h-12 p-2">
            <span className="font-semibold text-[8px] text-slate-500">Customer Signature</span>
          </div>
        </div>

        <div className="col-span-5 flex flex-col divide-y divide-black border-l border-black min-w-0">
          <div className="p-2 space-y-1">
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-slate-700">Taxable Amount</span>
              <span className="font-mono font-bold text-slate-900 whitespace-nowrap">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-2 text-slate-700">
              <span className="font-semibold">Add : IGST</span>
              <span className="font-mono whitespace-nowrap">₹{gstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-2 border-t border-slate-200 pt-1 font-semibold text-slate-700">
              <span>Total Tax</span>
              <span className="font-mono whitespace-nowrap">₹{gstTotal.toFixed(2)}</span>
            </div>
            {Math.abs(roundOff) > 0.001 && (
              <div className="flex justify-between gap-2 text-slate-500 text-[10px]">
                <span>Round Off</span>
                <span className="font-mono whitespace-nowrap">
                  {roundOff > 0 ? "+" : ""}
                  {roundOff.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-2 border-t-2 border-slate-900 pt-1.5 font-extrabold text-slate-950 text-xs">
              <span>Total Amount After Tax</span>
              <span className="font-mono text-sm text-[#008ba3] whitespace-nowrap">
                ₹{roundedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-2 text-[8px] leading-tight text-slate-700 flex flex-col relative min-h-[120px]">
            <div className="text-right font-semibold text-[7px] text-slate-500">(E & O.E.)</div>
            <div className="text-center font-bold text-slate-800 mt-2 border-t border-dashed border-slate-200 pt-1">
              Certified that the particulars given above are true and correct.
            </div>
            <div className="text-right font-extrabold text-slate-950 uppercase tracking-tight mt-1 text-[9px] break-words">
              For {sellerDetails.businessName || "—"}
            </div>
            <div className="absolute top-[45%] left-[5%] right-[5%] text-center -rotate-12 select-none pointer-events-none opacity-20">
              <span className="text-[9px] font-black text-slate-900 tracking-wider uppercase border border-slate-900 px-1 py-0.5">
                This is a computer generated invoice no signature required
              </span>
            </div>
            <div className="text-right font-bold text-slate-600 text-[8px] uppercase tracking-wide mt-8 pt-1 border-t border-slate-100">
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] italic font-semibold text-slate-700 text-center mt-2">
        Thank you for shopping with us!
      </div>
    </div>
  );
}
