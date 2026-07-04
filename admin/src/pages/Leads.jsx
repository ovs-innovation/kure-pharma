import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  FiTrash2,
  FiUser,
  FiMail,
  FiMessageCircle,
  FiCheck,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import exportFromJSON from "export-from-json";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import LeadServices from "@/services/LeadServices";
import { notifySuccess, notifyError } from "@/utils/toast";

const getLangValue = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val.en) return val.en;
  return JSON.stringify(val);
};

const getSafeImages = (imageData) => {
  if (!imageData) return [];
  if (Array.isArray(imageData)) return imageData;
  if (typeof imageData === "string") return [imageData];
  return [];
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchVariant, setSearchVariant] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await LeadServices.getDashboardCount();
      setStats(res);
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  };
  const [totalResults, setTotalResults] = useState(0);
  const [loadingExport, setLoadingExport] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchLeads = async (params = {}) => {
    setLoading(true);
    try {
      const res = await LeadServices.getAllLeads({
        name: searchName,
        email: searchEmail,
        phone: searchPhone,
        variant: searchVariant,
        status: searchStatus,
        page: currentPage,
        limit: resultsPerPage,
        startDate,
        endDate,
        ...params,
      });
      setLeads(res.leads || []);
      setTotalResults(res.totalDoc || (res.leads ? res.leads.length : 0));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads({
      name: searchName,
      email: searchEmail,
      phone: searchPhone,
      variant: searchVariant,
      status: searchStatus,
      page: currentPage,
      limit: resultsPerPage,
      startDate,
      endDate,
    });
    // eslint-disable-next-line
  }, [
    searchName,
    searchEmail,
    searchPhone,
    searchVariant,
    searchStatus,
    startDate,
    endDate,
    currentPage,
    resultsPerPage,
  ]);

  useEffect(() => {
    fetchStats();
  }, [leads]);

  const handleFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchEmail("");
    setSearchPhone("");
    setSearchVariant("");
    setSearchStatus("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    fetchLeads({
      name: "",
      email: "",
      phone: "",
      variant: "",
      status: "",
      page: 1,
      startDate: "",
      endDate: "",
    });
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      await LeadServices.deleteLead(leadToDelete._id);
      notifySuccess("Lead deleted successfully");
      setDeleteModalOpen(false);
      setLeadToDelete(null);
      fetchLeads();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || "Failed to delete lead");
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingStatus(leadId);
    try {
      await LeadServices.updateLead(leadId, { status: newStatus });
      notifySuccess("Lead status updated successfully");
      fetchLeads();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadLeads = async () => {
    try {
      setLoadingExport(true);
      const res = await LeadServices.getAllLeads({
        name: searchName,
        email: searchEmail,
        phone: searchPhone,
        variant: searchVariant,
        startDate,
        endDate,
        page: 1,
        limit: 10000,
      });
      const exportData = (res.leads || []).map((lead) => ({
        name: lead.name,
        type: lead.isEnterprise ? "Enterprise" : "Individual",
        email: lead.email,
        phone: lead.phone,
        address: lead.address || "N/A",
        state: lead.state || "N/A",
        district: lead.district || "N/A",
        pincode: lead.pincode || "N/A",
        message: lead.message,
        product: lead.product?.items?.length > 0
          ? lead.product.items.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ')
          : getLangValue(lead.product?.title),
        category: lead.product?.items?.length > 0
          ? [...new Set(lead.product.items.map(i => i.category))].join(', ')
          : getLangValue(lead.product?.category?.name),
        price: lead.product?.items?.length > 0
            ? lead.product.items.reduce((acc, i) => acc + (i.price * i.quantity), 0)
            : lead.product?.prices?.price,
        quantity: lead.product?.items?.length > 0
            ? lead.product.items.reduce((acc, i) => acc + i.quantity, 0)
            : lead.quantity,
        enquiryType: lead.enquiryType || "",
        currency: lead.currency || "₹",
        unitPrice: lead.unitPrice,
        estimatedTotal: lead.estimatedTotal,
        discountPercent: lead.discountPercent,
        tierLabel: lead.tierLabel || "",
        pricingNote: lead.pricingNote || "",
        // Variant information
        variantTitle:
          getLangValue(lead.product?.variant?.title) || "No variant",
        variantSku: lead.product?.variant?.sku || lead.product?.sku || "N/A",
        variantBarcode: lead.product?.variant?.barcode || "N/A",
        variantSlug: lead.product?.variant?.slug || "N/A",
        // Additional context
        hasVariants: lead.product?.hasVariants ? "Yes" : "No",
        totalVariants: lead.product?.totalVariants || "0",
        status: lead.status || "pending",
        enquiryDate: lead.enquiryDate
          ? new Date(lead.enquiryDate).toLocaleString()
          : "N/A",
        currentLanguage: lead.currentLanguage || "N/A",
        date: new Date(lead.createdAt).toLocaleString(),
      }));
      exportFromJSON({
        data: exportData,
        fileName: "leads",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      alert(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between my-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-gray-150 tracking-tight">
            Customer Enquiries
          </h1>
          <p className="text-xs text-gray-450 dark:text-gray-450 mt-1">
            Manage incoming product and service inquiries
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadLeads}
          disabled={loadingExport}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          {loadingExport ? (
            <span>Processing...</span>
          ) : (
            <>
              Download CSV
              <IoCloudDownloadOutline className="text-sm" />
            </>
          )}
        </button>
      </div>


      {/* Filter Card */}
      <Card className="min-w-0 shadow-sm overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-150 dark:border-gray-700/80 mb-6 rounded-2xl">
        <CardBody className="p-5">
          <form onSubmit={handleFilter} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">Search Name</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="search"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="E.g. Glenza"
                    style={{ paddingLeft: "36px" }}
                    className="w-full pr-4 py-2 border border-gray-250 dark:border-gray-650 rounded-xl text-xs dark:bg-gray-750 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0b1d3d]"
                  />
                  <FiUser style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none" }} className="text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">Search Email</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="search"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="E.g. customer@kure.com"
                    style={{ paddingLeft: "36px" }}
                    className="w-full pr-4 py-2 border border-gray-250 dark:border-gray-650 rounded-xl text-xs dark:bg-gray-750 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0b1d3d]"
                  />
                  <FiMail style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none" }} className="text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">Search Phone</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="search"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    placeholder="E.g. +91 9898..."
                    style={{ paddingLeft: "36px" }}
                    className="w-full pr-4 py-2 border border-gray-250 dark:border-gray-650 rounded-xl text-xs dark:bg-gray-750 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0b1d3d]"
                  />
                  <FiPhone style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none" }} className="text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">Search Variant / Product</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="search"
                    value={searchVariant}
                    onChange={(e) => setSearchVariant(e.target.value)}
                    placeholder="E.g. Eltrombopag"
                    style={{ paddingLeft: "36px" }}
                    className="w-full pr-4 py-2 border border-gray-250 dark:border-gray-650 rounded-xl text-xs dark:bg-gray-750 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0b1d3d]"
                  />
                  <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none" }} className="text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 items-end pt-2">
              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">Filter Status</label>
                <select
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                  className="block w-full text-xs border border-gray-250 dark:border-gray-650 dark:bg-gray-750 dark:text-gray-200 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0b1d3d] cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">Start Date</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ paddingLeft: "36px" }}
                    className="w-full pr-4 py-2 border border-gray-250 dark:border-gray-650 rounded-xl text-xs dark:bg-gray-750 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0b1d3d] cursor-pointer"
                  />
                  <FiCalendar style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none" }} className="text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest block mb-1.5">End Date</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ paddingLeft: "36px" }}
                    className="w-full pr-4 py-2 border border-gray-250 dark:border-gray-650 rounded-xl text-xs dark:bg-gray-750 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0b1d3d] cursor-pointer"
                  />
                  <FiCalendar style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 10, pointerEvents: "none" }} className="text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0b1d3d] hover:bg-[#152e5a] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiFilter /> Filter
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 border border-gray-250 dark:border-gray-650 dark:bg-gray-750 dark:text-gray-200 hover:bg-gray-55 dark:hover:bg-gray-750 font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiRefreshCw /> Reset
                </button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
      {loading ? (
        <TableLoading row={8} col={5} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>      ) : leads.length > 0 ? (
        <>
          {/* Mobile Enquiries Card Layout */}
          <div className="block lg:hidden space-y-4 mb-8">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-750 p-4 shadow-xs relative space-y-3"
              >
                {/* Header: Name and badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">
                        {lead.name}
                      </h4>
                      {lead.isEnterprise && (
                        <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                          Enterprise
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(lead.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10"
                      title="View details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLeadToDelete(lead);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                      title="Delete Lead"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Data */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 border-t border-b border-gray-100 dark:border-gray-750 py-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <FiMail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate font-mono">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{lead.phone}</span>
                  </div>
                </div>

                {/* Service/Product Requested */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Requested:</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      {lead.service || "General enquiry"}
                    </span>
                  </div>
                  
                  <div className="text-[11px] text-gray-700 dark:text-gray-300">
                    {lead.product?.items?.length > 0 ? (
                      <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded">
                        {lead.product.items.length} Products
                      </span>
                    ) : (
                      <span className="italic">{getLangValue(lead.product?.title) || "No Product"}</span>
                    )}
                  </div>

                  {/* Quantity and Price Tags */}
                  {(lead.quantity || lead.estimatedTotal) && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {lead.quantity != null && (
                        <span className="text-[9px] font-bold text-[#0b1d3d] dark:text-blue-300 bg-[#0b1d3d]/5 dark:bg-blue-900/10 px-2 py-0.5 rounded">
                          Qty: {lead.quantity}
                        </span>
                      )}
                      {lead.estimatedTotal != null && (
                        <span className="text-[9px] font-bold text-green-800 dark:text-green-300 bg-green-50/10 dark:bg-green-900/10 px-2 py-0.5 rounded">
                          Est: {lead.currency || "₹"}{lead.estimatedTotal}
                        </span>
                      )}
                      {lead.enquiryType === "bulk" && (
                        <span className="text-[8px] font-black uppercase text-amber-850 dark:text-amber-300 bg-amber-50/10 dark:bg-amber-900/10 px-1.5 py-0.5 rounded">
                          Bulk
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer: Schedule & Status select */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-750">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-gray-400 font-bold bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-lg">
                    <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{lead.serviceDate || "N/A"}</span>
                  </div>

                  <div>
                    <select
                      value={lead.status || "pending"}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      disabled={updatingStatus === lead._id}
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border-0 ${getStatusColor(lead.status || "pending")} ${
                        updatingStatus === lead._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Pagination Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-750 p-4 flex justify-center shadow-xs">
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={setCurrentPage}
                label="Table navigation"
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <TableContainer className="hidden lg:block mb-8 rounded-3xl overflow-hidden border border-gray-150 dark:border-gray-700/80 shadow-xs">
            <Table className="min-w-[720px]">
              <TableHeader>
                <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-500 uppercase tracking-wider text-[10px] font-black">
                  <TableCell className="py-3">Customer Info</TableCell>
                  <TableCell className="py-3">Service / Product Requested</TableCell>
                  <TableCell className="py-3">Schedule Date</TableCell>
                  <TableCell className="py-3">Current Status</TableCell>
                  <TableCell className="py-3">Date Submitted</TableCell>
                  <TableCell className="py-3 text-right">Actions</TableCell>
                </tr>
              </TableHeader>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-750 text-xs font-semibold text-gray-755 dark:text-gray-305 bg-white dark:bg-gray-800">
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-blue-50/30 dark:hover:bg-gray-755/20 transition-colors"
                  >
                    <TableCell
                      className="cursor-pointer py-3.5"
                      onClick={() => {
                        setSelectedLead(lead);
                        setModalOpen(true);
                      }}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-855 dark:text-gray-100">{lead.name}</span>
                          {lead.isEnterprise && (
                            <span className="text-[8px] bg-indigo-650 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Enterprise</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">{lead.email}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{lead.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer py-3.5"
                      onClick={() => {
                        setSelectedLead(lead);
                        setModalOpen(true);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{lead.service || "N/A"}</span>
                        <div className="flex items-center space-x-2 mt-1">
                           {lead.product?.items?.length > 0 ? (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded">
                              {lead.product.items.length} Products
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 italic truncate max-w-[140px] sm:max-w-[200px]">{getLangValue(lead.product?.title) || "No Product"}</span>
                          )}
                        </div>
                        {(lead.quantity || lead.estimatedTotal) && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {lead.quantity != null && (
                              <span className="text-[9px] font-bold text-[#0b1d3d] dark:text-blue-300 bg-[#0b1d3d]/5 dark:bg-blue-900/10 px-2 py-0.5 rounded">
                                Qty: {lead.quantity}
                              </span>
                            )}
                            {lead.estimatedTotal != null && (
                              <span className="text-[9px] font-bold text-green-800 dark:text-green-300 bg-green-55/10 dark:bg-green-900/10 px-2 py-0.5 rounded">
                                Est: {lead.currency || "₹"}{lead.estimatedTotal}
                              </span>
                            )}
                            {lead.enquiryType === "bulk" && (
                              <span className="text-[8px] font-black uppercase text-amber-850 dark:text-amber-300 bg-amber-50/10 dark:bg-amber-900/10 px-1.5 py-0.5 rounded">
                                Bulk
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer py-3.5"
                      onClick={() => {
                        setSelectedLead(lead);
                        setModalOpen(true);
                      }}
                    >
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 px-2 py-1 rounded-lg">
                        {lead.serviceDate || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <select
                        value={lead.status || "pending"}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        disabled={updatingStatus === lead._id}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border-0 ${getStatusColor(lead.status || "pending")} ${
                          updatingStatus === lead._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer py-3.5"
                      onClick={() => {
                        setSelectedLead(lead);
                        setModalOpen(true);
                      }}
                    >
                      <span className="text-gray-500 dark:text-gray-450">{new Date(lead.createdAt).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10"
                          title="View details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeadToDelete(lead);
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                          title="Delete Lead"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TableFooter className="bg-gray-50/50 dark:bg-gray-900/20">
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={setCurrentPage}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <NotFound title="No leads found." />
      )}
      {/* Lead Details Modal */}
      {modalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] p-4 sm:p-6 relative overflow-y-auto overflow-x-hidden min-w-0">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-green-600 text-2xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Lead Details</h2>

            {/* Product Images Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                {selectedLead.product?.items?.length > 0 
                  ? "Requested Products" 
                  : selectedLead.product?.variant
                  ? "Variant Images"
                  : "Product Images"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {(() => {
                  if (selectedLead.product?.items?.length > 0) {
                    return selectedLead.product.items.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 p-2 border border-gray-100 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/no-result.svg";
                          }}
                        />
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-800 line-clamp-1 w-24">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{item.category || "No Category"}</p>
                          <p className="text-[10px] text-green-600 font-bold">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ));
                  }

                  const variantImages = getSafeImages(selectedLead.product?.variant?.image);
                  const mainImages = getSafeImages(selectedLead.product?.images);

                  if (variantImages.length > 0) {
                    return variantImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Variant ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => { e.target.src = "/no-result.svg"; }}
                        />
                      </div>
                    ));
                  } else if (mainImages.length > 0) {
                    return mainImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => { e.target.src = "/no-result.svg"; }}
                        />
                      </div>
                    ));
                  } else {
                    return (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs text-center">No Image</span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            {/* Lead Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Name:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Type:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      {selectedLead.isEnterprise ? "Enterprise / Company" : "Individual Customer"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Full Address:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 text-right max-w-[200px]">
                      {selectedLead.address || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      State:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.state || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      District:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.district || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Pincode:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.pincode || "N/A"}
                    </span>
                  </div>
                   <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Date:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {new Date(selectedLead.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedLead.status || "pending")}`}>
                      {(selectedLead.status || "pending").charAt(0).toUpperCase() + (selectedLead.status || "pending").slice(1).replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Requested Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                  Service Request Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Selected Service:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      {selectedLead.service || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Schedule / Date:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      {selectedLead.serviceDate || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Product Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                  Product Overview
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Total Products:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.product?.items?.length || (selectedLead.product?.title ? 1 : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Main Category:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedLead.product?.items?.length > 0
                        ? [...new Set(selectedLead.product.items.map(i => i.category))].join(', ')
                        : (getLangValue(selectedLead.product?.category?.name) || "Not specified")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variant or Product Information */}
            {selectedLead.product?.variant ? (
              // Show variant information if variant exists
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 border-b pb-2">
                  Selected Variant Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Variant Title:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {getLangValue(selectedLead.product.variant.title)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Variant SKU:</span>
                      <span className="text-gray-800 dark:text-gray-200">{selectedLead.product.variant.sku || "Not specified"}</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Variant Barcode:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedLead.product.variant.barcode ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Variant Slug:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedLead.product.variant.slug || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Variant Description:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 max-w-xs truncate">
                        {getLangValue(
                          selectedLead.product.variant.description
                        ) || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Variant Highlights:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 max-w-xs truncate">
                        {getLangValue(
                          selectedLead.product.variant.highlights
                        ) || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Show product information if no variant
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 border-b pb-2">
                  Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Product Title:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {getLangValue(selectedLead.product?.title)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Product SKU:</span>
                      <span className="text-gray-800 dark:text-gray-200">{selectedLead.product?.sku || "Not specified"}</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Product Slug:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedLead.product?.slug || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Product Description:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 max-w-xs truncate">
                        {getLangValue(selectedLead.product?.description) ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Product Highlights:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 max-w-xs truncate">
                        {getLangValue(selectedLead.product?.highlights) ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        Stock:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedLead.product?.stock ||
                          selectedLead.product?.stockQuantity ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 border-b pb-2">
                Customer Message
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {selectedLead.message || "No message provided"}
                </p>
              </div>
            </div>

            {/* Additional Context */}
            {(selectedLead.service || selectedLead.serviceDate || selectedLead.message) && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-[#EF4036] border-b pb-2">
                  Service Quote Details
                </h3>
                <div className="bg-red-50 dark:bg-gray-700/50 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Requested Service</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedLead.service || "General Test & Tag"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Requested Schedule</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedLead.serviceDate || "Not Specified"}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Location / Site</span>
                          <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{selectedLead.location || "N/A"}</span>
                          <span className="text-sm text-gray-500">{selectedLead.district}, {selectedLead.state} - {selectedLead.pincode}</span>
                        </div>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-red-200/50">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 block">Customer Message</span>
                      <p className="text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-800 p-4 rounded-lg italic">
                        "{selectedLead.message || "No special instructions provided."}"
                      </p>
                   </div>
                </div>
              </div>
            )}

            {/* Quantity & pricing (bulk enquiries) */}
            {(selectedLead.quantity || selectedLead.unitPrice || selectedLead.estimatedTotal) && (
              <div className="mt-6 rounded-xl border-2 border-green-200 bg-green-50/50 dark:bg-gray-800/50 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 border-b border-green-200 pb-2">
                  Quantity &amp; pricing estimate
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Type</p>
                    <p className="font-bold capitalize">{selectedLead.enquiryType || "bulk"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Quantity</p>
                    <p className="font-bold">{selectedLead.quantity ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Slab</p>
                    <p className="font-bold">{selectedLead.tierLabel || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Unit price</p>
                    <p className="font-bold">
                      {selectedLead.listUnitPrice != null && (
                        <span className="line-through text-gray-400 mr-2 text-xs">
                          {selectedLead.currency || "₹"}
                          {selectedLead.listUnitPrice}
                        </span>
                      )}
                      {selectedLead.currency || "₹"}
                      {selectedLead.unitPrice ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Discount</p>
                    <p className="font-bold text-green-700">
                      {selectedLead.discountPercent > 0
                        ? `${selectedLead.discountPercent}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Est. total</p>
                    <p className="text-xl font-black text-[#0b1d3d] dark:text-white">
                      {selectedLead.currency || "₹"}
                      {selectedLead.estimatedTotal ?? "—"}
                    </p>
                  </div>
                </div>
                {selectedLead.pricingNote && (
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 italic">
                    {selectedLead.pricingNote}
                  </p>
                )}
              </div>
            )}

            {/* Product Section for Both Single and Multi-Product Leads */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                {selectedLead.product?.items?.length > 0 ? "Items in Quote Request" : "Product Details"}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {selectedLead.product?.items?.length > 0 ? (
                  // MULTI-PRODUCT (from Cart)
                  selectedLead.product.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <img 
                        src={item.image} 
                        className="w-20 h-20 object-cover rounded-lg shadow-sm border" 
                        onError={(e) => e.target.src = "/no-result.svg"}
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm font-bold text-red-600">Quantity: {item.quantity}</span>
                          <span className="text-xs text-gray-400">ID: {item.id}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // SINGLE PRODUCT (from Product Detail page)
                  <div className="flex flex-col md:flex-row gap-6 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex gap-2">
                       {getSafeImages(selectedLead.product?.variant?.image).concat(getSafeImages(selectedLead.product?.images)).slice(0,1).map((img, i) => (
                         <img key={i} src={img} className="w-32 h-32 object-cover rounded-xl border shadow-sm" onError={(e) => e.target.src = "/no-result.svg"} />
                       ))}
                       {(!selectedLead.product?.images || selectedLead.product.images.length === 0) && !selectedLead.product?.variant?.image && (
                         <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs text-center p-2">No Image Found</div>
                       )}
                    </div>
                    <div className="flex-grow space-y-2">
                       <h4 className="text-xl font-bold text-gray-900">{getLangValue(selectedLead.product?.title) || "Manual Quote"}</h4>
                       <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                         {getLangValue(selectedLead.product?.category?.name) || "General"}
                       </span>
                       <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Variant</p>
                            <p className="text-sm font-semibold">{getLangValue(selectedLead.product?.variant?.title) || "Standard"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">SKU</p>
                            <p className="text-sm font-semibold">{selectedLead.product?.variant?.sku || selectedLead.product?.sku || "N/A"}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => {
                setDeleteModalOpen(false);
                setLeadToDelete(null);
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Delete Lead
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the lead from{" "}
              <strong>{leadToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                layout="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setLeadToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteLead}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leads;
