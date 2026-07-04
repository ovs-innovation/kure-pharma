import {
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  WindmillContext,
} from "@windmill/react-ui";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiUser,
  FiMessageCircle,
  FiMail,
  FiShoppingBag,
  FiCalendar,
  FiTrendingUp,
  FiActivity,
  FiClock
} from "react-icons/fi";

//internal import
import useAsync from "@/hooks/useAsync";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import LeadServices from "@/services/LeadServices";
import ProductServices from "@/services/ProductServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import { LeadsBarChart, LeadsDoughnutChart } from "@/components/chart/LeadsChart";

const ModernMetricCard = ({ title, value, icon: Icon, gradient, loading }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] bg-gradient-to-br ${gradient}`}>
      <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-6 translate-y-6 scale-[1.8] pointer-events-none">
        <Icon className="w-24 h-24" />
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/80 truncate">{title}</p>
          {loading ? (
            <div className="h-6 w-12 sm:w-16 bg-white/20 animate-pulse rounded" />
          ) : (
            <h3 className="text-xl sm:text-3xl font-black tracking-tight">{value}</h3>
          )}
        </div>
        <div className="p-2 sm:p-3.5 bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/15">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

const ModernGlassCard = ({ title, value, icon: Icon, iconColor, loading }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-150 dark:border-gray-700/80 p-3 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3 sm:gap-4">
      <div className={`p-2 sm:p-3 rounded-xl ${iconColor} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div>
        <p className="text-[8px] sm:text-[9px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-0.5 sm:mb-1 truncate">{title}</p>
        {loading ? (
          <div className="h-4 w-10 bg-gray-250 dark:bg-gray-700 animate-pulse rounded" />
        ) : (
          <h4 className="text-sm sm:text-lg font-black text-gray-855 dark:text-gray-200">{value}</h4>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  // Lead statistics
  const { data: dashboardLeadCount, loading: loadingLeadCount } = useAsync(
    LeadServices.getDashboardCount
  );

  const { data: dashboardLeadData, loading: loadingLeadData } = useAsync(
    LeadServices.getDashboardLeadData
  );

  const { data: dashboardRecentLeads, loading: loadingRecentLeads } = useAsync(
    () => LeadServices.getDashboardRecentLeads({ page: 1, limit: 8 })
  );

  // Fetch total products
  const { data: productsData, loading: loadingProducts } = useAsync(
    () => ProductServices.getAllProducts({ page: 1, limit: 1 })
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between my-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-850 dark:text-gray-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-455 mt-1">
            Real-time analytics and customer enquiry intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 py-1.5 px-3 rounded-xl shadow-xs border border-gray-150 dark:border-gray-750 w-fit">
          <FiCalendar className="text-blue-500 w-4 h-4" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <AnimatedContent>
        {/* Row 1: Core Metrics */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
          <ModernMetricCard
            title="Total Products"
            value={productsData?.totalDoc || 0}
            icon={FiShoppingBag}
            gradient="from-[#0f766e] via-[#0d9488] to-[#14b8a6]"
            loading={loadingProducts}
          />
          <ModernMetricCard
            title="Total Leads"
            value={dashboardLeadCount?.totalLeads || 0}
            icon={FiUser}
            gradient="from-[#4338ca] via-[#4f46e5] to-[#6366f1]"
            loading={loadingLeadCount}
          />
          <ModernMetricCard
            title="Pending Leads"
            value={dashboardLeadCount?.totalPendingLeads || 0}
            icon={FiMessageCircle}
            gradient="from-[#b45309] via-[#d97706] to-[#f59e0b]"
            loading={loadingLeadCount}
          />
          <ModernMetricCard
            title="Contacted Leads"
            value={dashboardLeadCount?.totalContactedLeads || 0}
            icon={FiMail}
            gradient="from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]"
            loading={loadingLeadCount}
          />
          <ModernMetricCard
            title="Completed Leads"
            value={dashboardLeadCount?.totalCompletedLeads || 0}
            icon={FiCheck}
            gradient="from-[#047857] via-[#059669] to-[#10b981]"
            loading={loadingLeadCount}
          />
        </div>

        {/* Row 2: Timeline Metrics */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
          <ModernGlassCard
            title="Today Leads"
            value={dashboardLeadData?.todayLeads || 0}
            icon={FiClock}
            iconColor="text-purple-600 bg-purple-100"
            loading={loadingLeadData}
          />
          <ModernGlassCard
            title="Yesterday Leads"
            value={dashboardLeadData?.yesterdayLeads || 0}
            icon={FiClock}
            iconColor="text-orange-500 bg-orange-100"
            loading={loadingLeadData}
          />
          <ModernGlassCard
            title="This Month Leads"
            value={dashboardLeadData?.thisMonthLeads || 0}
            icon={FiCalendar}
            iconColor="text-pink-500 bg-pink-100"
            loading={loadingLeadData}
          />
          <ModernGlassCard
            title="Last Month Leads"
            value={dashboardLeadData?.lastMonthLeads || 0}
            icon={FiCalendar}
            iconColor="text-teal-600 bg-teal-100"
            loading={loadingLeadData}
          />
          <ModernGlassCard
            title="All Time Leads"
            value={dashboardLeadData?.allTimeLeads || 0}
            icon={FiTrendingUp}
            iconColor="text-green-600 bg-green-100"
            loading={loadingLeadData}
          />
        </div>

        {/* Row 3: Lead Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-150 dark:border-gray-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest">Enquiry Trend</h3>
                <p className="text-[10px] text-gray-400">Total inquiries received daily (Last 7 Days)</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <FiActivity className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            {loadingLeadData ? (
              <div className="h-64 flex items-center justify-center text-gray-450">Loading Chart...</div>
            ) : (
              <div className="relative h-64">
                <LeadsBarChart leadsByDate={dashboardLeadData?.leadsByDate} />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-150 dark:border-gray-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest">Status Distribution</h3>
                <p className="text-[10px] text-gray-400">Breakdown of active/completed enquiries</p>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <FiTrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
            {loadingLeadData ? (
              <div className="h-64 flex items-center justify-center text-gray-450">Loading Chart...</div>
            ) : (
              <div className="relative h-64 flex items-center justify-center">
                <LeadsDoughnutChart leadsByStatus={dashboardLeadData?.leadsByStatus} />
              </div>
            )}
          </div>
        </div>
      </AnimatedContent>

      {/* Row 4: Recent Leads Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700/80 p-6 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-black text-gray-855 dark:text-gray-200 uppercase tracking-widest">Recent Enquiries</h2>
            <p className="text-[10px] text-gray-400">Latest queries submitted by healthcare professionals</p>
          </div>
          <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        {loadingRecentLeads ? (
          <TableLoading row={5} col={5} />
        ) : dashboardRecentLeads?.leads?.length > 0 ? (
          <>
            {/* Mobile View: Recent Enquiries Card List */}
            <div className="block md:hidden space-y-3 mb-4">
              {dashboardRecentLeads.leads.map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-150 dark:border-gray-750 p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">
                        {lead.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        lead.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-450"
                          : lead.status === "contacted"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-450"
                          : lead.status === "in_progress"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-450"
                          : lead.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-455"
                          : lead.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-455"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-450"
                      }`}
                    >
                      {(lead.status || "pending").replace("_", " ")}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-750">
                    <span className="truncate font-mono">{lead.email}</span>
                    <span className="text-right truncate">{lead.phone}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table Container */}
            <TableContainer className="hidden md:block mb-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-750 shadow-xs">
              <Table>
                <TableHeader>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-500 uppercase tracking-wider text-[10px] font-black">
                    <TableCell className="py-3">Customer Name</TableCell>
                    <TableCell className="py-3">Email ID</TableCell>
                    <TableCell className="py-3">Phone Number</TableCell>
                    <TableCell className="py-3 text-center">Status</TableCell>
                    <TableCell className="py-3 text-right">Date & Time</TableCell>
                  </tr>
                </TableHeader>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-305 bg-white dark:bg-gray-800">
                  {dashboardRecentLeads.leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-blue-50/40 dark:hover:bg-gray-700/20 transition-colors">
                      <TableCell className="py-3.5 font-bold text-gray-800 dark:text-gray-100">{lead.name}</TableCell>
                      <TableCell className="py-3.5 font-mono">{lead.email}</TableCell>
                      <TableCell className="py-3.5">{lead.phone}</TableCell>
                      <TableCell className="py-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            lead.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-450"
                              : lead.status === "contacted"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-450"
                              : lead.status === "in_progress"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-450"
                              : lead.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-455"
                              : lead.status === "cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-455"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-450"
                          }`}
                        >
                          {(lead.status || "pending").replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right text-gray-500 dark:text-gray-400">
                        {new Date(lead.createdAt).toLocaleString()}
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <TableFooter className="bg-gray-50/50 dark:bg-gray-900/20">
                <Pagination
                  totalResults={dashboardRecentLeads?.totalLeads || 0}
                  resultsPerPage={8}
                  onChange={(page) => {
                    // Handle pagination if needed
                  }}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          </>
        ) : (
          <NotFound title="Sorry, There are no leads right now." />
        )}
      </div>
    </>
  );
};

export default Dashboard;
