import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Package,
  Briefcase,
  KeyRound,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  Box,
  User,
  Home as HomeIcon,
  X,
} from 'lucide-react';
import {
  packageApi,
  Package as PackageType,
  JobPosting,
  JobUpsertData,
  JobApplicationRecord,
  ApplicationStatus,
  CreatePackageData,
  UpdatePackageData,
  careerApi,
  authApi,
} from '../utils/api';
import { ADMIN_LOGIN_PATH } from '../constants/security';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationStatusDrafts, setApplicationStatusDrafts] = useState<Record<string, ApplicationStatus>>({});
  const [applicationStatusSaving, setApplicationStatusSaving] = useState<Record<string, boolean>>({});
  const [applicationSearch, setApplicationSearch] = useState('');
  const [applicationJobFilter, setApplicationJobFilter] = useState('');
  const [applicationPage, setApplicationPage] = useState(1);
  const [applicationTotalPages, setApplicationTotalPages] = useState(1);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const parseErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const handleUnauthorized = useCallback(
    (error: unknown) => {
      if (error instanceof Error && /token|unauthorized|expired|forbidden/i.test(error.message)) {
        authApi.logout();
        navigate(ADMIN_LOGIN_PATH);
        return true;
      }
      return false;
    },
    [navigate]
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (!authApi.getToken()) {
        navigate(ADMIN_LOGIN_PATH);
        return;
      }

      try {
        await authApi.me();
        await Promise.all([fetchPackages(), fetchJobs()]);
      } catch (error) {
        authApi.logout();
        navigate(ADMIN_LOGIN_PATH);
      }
    };

    bootstrap();
  }, [navigate]);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit: 10 };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const data = await packageApi.getAll(params);
      setPackages(data.packages);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to load packages'));
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, handleUnauthorized]);

  useEffect(() => {
    if (!authApi.getToken()) return;
    fetchPackages();
  }, [fetchPackages]);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await careerApi.getAll();
      setJobs(response);
    } catch (error) {
      setActionError(parseErrorMessage(error, 'Failed to load jobs'));
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    try {
      const result = await careerApi.adminGetApplications({
        page: applicationPage,
        limit: 10,
        search: applicationSearch,
        jobId: applicationJobFilter,
      });
      setApplications(result.applications);
      setApplicationStatusDrafts(
        result.applications.reduce((acc, item) => {
          acc[item.id] = item.status;
          return acc;
        }, {} as Record<string, ApplicationStatus>)
      );
      setApplicationTotalPages(result.totalPages);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to load applications'));
      }
    } finally {
      setApplicationsLoading(false);
    }
  }, [applicationPage, applicationSearch, applicationJobFilter, handleUnauthorized]);

  const handleCreatePackage = async (data: CreatePackageData) => {
    try {
      await packageApi.create(data);
      setShowCreateModal(false);
      setActionSuccess('Package created successfully.');
      await fetchPackages();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to create package.'));
      }
    }
  };

  const handleUpdatePackage = async (id: string, data: UpdatePackageData) => {
    try {
      await packageApi.update(id, data);
      setShowEditModal(false);
      setSelectedPackage(null);
      setActionSuccess('Package updated successfully.');
      await fetchPackages();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to update package.'));
      }
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await packageApi.delete(id);
      setActionSuccess('Package deleted successfully.');
      await fetchPackages();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to delete package.'));
      }
    }
  };

  const handleCreateJob = async (data: JobUpsertData) => {
    try {
      await careerApi.adminCreate(data);
      setShowCreateJobModal(false);
      setActionSuccess('Job created successfully.');
      await fetchJobs();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to create job.'));
      }
    }
  };

  const handleUpdateJob = async (id: string, data: JobUpsertData) => {
    try {
      await careerApi.adminUpdate(id, data);
      setShowEditJobModal(false);
      setSelectedJob(null);
      setActionSuccess('Job updated successfully.');
      await fetchJobs();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to update job.'));
      }
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await careerApi.adminDelete(id);
      setActionSuccess('Job deleted successfully.');
      await fetchJobs();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to delete job.'));
      }
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string) => {
    const nextStatus = applicationStatusDrafts[applicationId];
    if (!nextStatus) return;
    setApplicationStatusSaving((prev) => ({ ...prev, [applicationId]: true }));
    try {
      await careerApi.adminUpdateApplicationStatus(applicationId, nextStatus);
      setActionSuccess('Application status updated.');
      await fetchApplications();
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to update application status.'));
      }
    } finally {
      setApplicationStatusSaving((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleExportApplications = async () => {
    try {
      const blob = await careerApi.adminExportApplicationsCsv({
        search: applicationSearch,
        jobId: applicationJobFilter,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `applications-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to export CSV.'));
      }
    }
  };

  const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const result = await authApi.changePassword(data);
      setActionSuccess(result.message);
      setShowChangePasswordModal(false);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        setActionError(parseErrorMessage(error, 'Failed to change password.'));
      }
    }
  };

  useEffect(() => {
    if (!authApi.getToken()) return;
    fetchApplications();
  }, [fetchApplications]);

  const filteredPackages = packages.filter((pkg) =>
    pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delayed: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatApplicationStatus = (status: ApplicationStatus) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const getApplicationStatusClass = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      new: 'bg-blue-50 text-[#1b75bc]',
      reviewed: 'bg-slate-100 text-[#2E4049]',
      shortlisted: 'bg-blue-100 text-[#1b75bc]',
      rejected: 'bg-slate-200 text-[#2E4049]',
    };
    return colors[status];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="pt-[85px] pb-20">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-4xl font-bold text-[#324048] mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Manage packages and tracking information</p>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2E4049] text-white font-semibold hover:bg-[#1f2c32] transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Change Password
              </button>
            </div>
            {actionError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </div>
            ) : null}
            {actionSuccess ? (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {actionSuccess}
              </div>
            ) : null}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Packages', value: packages.length, color: 'bg-blue-500' },
              { label: 'In Transit', value: packages.filter(p => p.status === 'in_transit').length, color: 'bg-purple-500' },
              { label: 'Delivered', value: packages.filter(p => p.status === 'delivered').length, color: 'bg-green-500' },
              { label: 'Pending', value: packages.filter(p => p.status === 'pending').length, color: 'bg-yellow-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-[#324048] mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by tracking number or recipient..."
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] appearance-none bg-white pr-10"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delayed">Delayed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#1b75bc] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#155a94] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Package
              </button>
            </div>
          </div>

          {/* Packages Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#324048]">
                      Tracking Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#324048]">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#324048]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#324048]">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#324048]">
                      Est. Delivery
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#324048]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Loading packages...
                      </td>
                    </tr>
                  ) : filteredPackages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No packages found
                      </td>
                    </tr>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1b75bc]">{pkg.trackingNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#2E4049]">{pkg.recipientName}</p>
                          <p className="text-sm text-gray-600">{pkg.recipientPhone}</p>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(pkg.status)}</td>
                        <td className="px-6 py-4">
                          <p className="text-[#2E4049]">{pkg.currentLocation || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#2E4049]">
                            {new Date(pkg.estimatedDelivery).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setShowEditModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Management */}
          <div className="mt-10 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#324048]">Job Management</h2>
                <p className="text-gray-600">Create and maintain career openings shown on the careers page</p>
              </div>
              <button
                onClick={() => setShowCreateJobModal(true)}
                className="bg-[#2E4049] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1f2c32] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Job
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        Loading jobs...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        No jobs available
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-4 py-3 font-bold text-[#2E4049]">{job.title}</td>
                        <td className="px-4 py-3 text-[#2E4049]">{job.department}</td>
                        <td className="px-4 py-3 text-[#2E4049]">{job.location}</td>
                        <td className="px-4 py-3 text-[#2E4049]">{job.type}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedJob(job);
                                setShowEditJobModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applications Management */}
          <div className="mt-10 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#324048]">Applications</h2>
                <p className="text-gray-600">View and filter submitted job applications</p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleExportApplications}
                  className="px-4 py-2 bg-[#2E4049] text-white rounded-lg font-bold hover:bg-[#1f2c32] transition-colors"
                >
                  Export CSV
                </button>
                <input
                  type="text"
                  value={applicationSearch}
                  onChange={(e) => {
                    setApplicationPage(1);
                    setApplicationSearch(e.target.value);
                  }}
                  placeholder="Search by name, email, phone, job..."
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] min-w-[280px]"
                />
                <select
                  value={applicationJobFilter}
                  onChange={(e) => {
                    setApplicationPage(1);
                    setApplicationJobFilter(e.target.value);
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                >
                  <option value="">All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Candidate</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Job</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Resume</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Submitted</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-[#324048]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicationsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        Loading applications...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    applications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-4 py-3">
                          <p className="font-bold text-[#2E4049]">{application.name}</p>
                          {application.coverLetter ? (
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{application.coverLetter}</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[#2E4049]">{application.email}</p>
                          <p className="text-sm text-gray-600">{application.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-[#2E4049]">{application.jobTitle}</td>
                        <td className="px-4 py-3 text-[#2E4049]">
                          {application.resumeFileName || '-'}
                        </td>
                        <td className="px-4 py-3 text-[#2E4049]">
                          {new Date(application.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getApplicationStatusClass(
                                application.status
                              )}`}
                            >
                              {formatApplicationStatus(application.status)}
                            </span>
                            <select
                              value={applicationStatusDrafts[application.id] || application.status}
                              onChange={(e) =>
                                setApplicationStatusDrafts((prev) => ({
                                  ...prev,
                                  [application.id]: e.target.value as ApplicationStatus,
                                }))
                              }
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] text-sm"
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id)}
                            disabled={
                              applicationStatusSaving[application.id] ||
                              (applicationStatusDrafts[application.id] || application.status) === application.status
                            }
                            className="px-4 py-2 bg-[#1b75bc] text-white rounded-lg font-semibold hover:bg-[#155a94] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {applicationStatusSaving[application.id] ? 'Saving...' : 'Update'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {applicationTotalPages > 1 ? (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {applicationPage} of {applicationTotalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setApplicationPage((prev) => Math.max(1, prev - 1))}
                    disabled={applicationPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setApplicationPage((prev) => Math.min(applicationTotalPages, prev + 1))}
                    disabled={applicationPage === applicationTotalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <PackageModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => handleCreatePackage(data as CreatePackageData)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPackage && (
        <PackageModal
          mode="edit"
          package={selectedPackage}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPackage(null);
          }}
          onSubmit={(data) => handleUpdatePackage(selectedPackage.id, data)}
        />
      )}

      {showCreateJobModal && (
        <JobModal
          mode="create"
          onClose={() => setShowCreateJobModal(false)}
          onSubmit={handleCreateJob}
        />
      )}

      {showEditJobModal && selectedJob && (
        <JobModal
          mode="edit"
          job={selectedJob}
          onClose={() => {
            setShowEditJobModal(false);
            setSelectedJob(null);
          }}
          onSubmit={(data) => handleUpdateJob(selectedJob.id, data)}
        />
      )}

      {showChangePasswordModal ? (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          onSubmit={handleChangePassword}
        />
      ) : null}

      <Footer />
    </div>
  );
}

// Package Modal Component
interface PackageModalProps {
  mode: 'create' | 'edit';
  package?: PackageType;
  onClose: () => void;
  onSubmit: (data: CreatePackageData | UpdatePackageData) => Promise<void> | void;
}

function PackageModal({ mode, package: pkg, onClose, onSubmit }: PackageModalProps) {
  const [formData, setFormData] = useState({
    senderName: pkg?.senderName || '',
    senderEmail: pkg?.senderEmail || '',
    senderPhone: pkg?.senderPhone || '',
    senderAddress: pkg?.senderAddress || '',
    recipientName: pkg?.recipientName || '',
    recipientEmail: pkg?.recipientEmail || '',
    recipientPhone: pkg?.recipientPhone || '',
    recipientAddress: pkg?.recipientAddress || '',
    weight: pkg?.weight || 0,
    dimensions: pkg?.dimensions || '',
    service: pkg?.service || 'Standard',
    status: pkg?.status || 'pending',
    statusDescription: '',
    currentLocation: pkg?.currentLocation || '',
    estimatedDelivery: pkg?.estimatedDelivery || '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const senderName = formData.senderName.trim();
    const senderPhone = formData.senderPhone.trim();
    const senderAddress = formData.senderAddress.trim();
    const recipientName = formData.recipientName.trim();
    const recipientPhone = formData.recipientPhone.trim();
    const recipientAddress = formData.recipientAddress.trim();
    const dimensions = formData.dimensions.trim();
    const service = formData.service.trim();
    const statusDescription = formData.statusDescription.trim();

    if (
      !senderName ||
      !senderPhone ||
      !senderAddress ||
      !recipientName ||
      !recipientPhone ||
      !recipientAddress ||
      !dimensions ||
      !service ||
      !formData.estimatedDelivery
    ) {
      setFormError('Please complete all required fields.');
      return;
    }

    if (!Number.isFinite(formData.weight) || Number(formData.weight) <= 0) {
      setFormError('Weight must be a positive number.');
      return;
    }

    if (mode === 'edit' && formData.status === 'delayed' && !statusDescription) {
      setFormError('Please provide the reason for delay.');
      return;
    }

    setFormError('');
    onSubmit({
      ...formData,
      senderName,
      senderPhone,
      senderAddress,
      recipientName,
      recipientPhone,
      recipientAddress,
      dimensions,
      service,
      statusDescription
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#324048]">
            {mode === 'create' ? 'Create New Package' : 'Edit Package'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          {/* Sender Information */}
          <div>
            <h3 className="text-xl font-bold text-[#324048] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Sender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => updateField('senderName', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.senderPhone}
                  onChange={(e) => updateField('senderPhone', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => updateField('senderEmail', e.target.value)}
                  placeholder="sender@company.ng"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.senderAddress}
                  onChange={(e) => updateField('senderAddress', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h3 className="text-xl font-bold text-[#324048] mb-4 flex items-center gap-2">
              <HomeIcon className="w-5 h-5" />
              Recipient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => updateField('recipientName', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) => updateField('recipientPhone', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => updateField('recipientEmail', e.target.value)}
                  placeholder="recipient@company.ng"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.recipientAddress}
                  onChange={(e) => updateField('recipientAddress', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="text-xl font-bold text-[#324048] mb-4 flex items-center gap-2">
              <Box className="w-5 h-5" />
              Package Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', parseFloat(e.target.value))}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Dimensions (LxWxH cm) *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30x20x15"
                  value={formData.dimensions}
                  onChange={(e) => updateField('dimensions', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => updateField('service', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Economy">Economy</option>
                  <option value="Priority">Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Estimated Delivery *
                </label>
                <input
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) => updateField('estimatedDelivery', e.target.value)}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                />
              </div>
            </div>
          </div>

          {/* Status (Edit mode only) */}
          {mode === 'edit' && (
            <div>
              <h3 className="text-xl font-bold text-[#324048] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Status & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      updateField('status', nextStatus);
                      if (nextStatus !== 'delayed') {
                        updateField('statusDescription', '');
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delayed">Delayed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {formData.status === 'delayed' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Reason for Delay *
                    </label>
                    <textarea
                      value={formData.statusDescription}
                      onChange={(e) => updateField('statusDescription', e.target.value)}
                      rows={3}
                      placeholder="Explain the delay so clients can see this update in tracking history."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) => updateField('currentLocation', e.target.value)}
                  placeholder="e.g., Ikeja Distribution Center"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1b75bc] text-white rounded-lg font-bold hover:bg-[#155a94] transition-colors"
            >
              {mode === 'create' ? 'Create Package' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface JobModalProps {
  mode: 'create' | 'edit';
  job?: JobPosting;
  onClose: () => void;
  onSubmit: (data: JobUpsertData) => void;
}

function JobModal({ mode, job, onClose, onSubmit }: JobModalProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    salary: job?.salary || '',
    description: job?.description || '',
    requirementsText: (job?.requirements || []).join('\n'),
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = formData.title.trim();
    const department = formData.department.trim();
    const location = formData.location.trim();
    const type = formData.type.trim();
    const description = formData.description.trim();
    const requirements = formData.requirementsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!title || !department || !location || !type || !description) {
      setFormError('Please complete all required fields.');
      return;
    }

    if (!requirements.length) {
      setFormError('Provide at least one requirement.');
      return;
    }

    setFormError('');
    onSubmit({
      title,
      department,
      location,
      type,
      salary: formData.salary.trim(),
      description,
      requirements,
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#324048]">
            {mode === 'create' ? 'Create New Job' : 'Edit Job'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => updateField('department', e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Salary</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => updateField('salary', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Requirements * (one per line)</label>
            <textarea
              value={formData.requirementsText}
              onChange={(e) => updateField('requirementsText', e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#2E4049] text-white rounded-lg font-bold hover:bg-[#1f2c32] transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              {mode === 'create' ? 'Create Job' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ChangePasswordModalProps {
  onClose: () => void;
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

function ChangePasswordModal({ onClose, onSubmit }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const validatePassword = (value: string) =>
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError('All fields are required.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setFormError('New password must include uppercase, lowercase, number, symbol, and 8+ characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      await onSubmit({ currentPassword, newPassword });
    } catch {
      // handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#324048]">Change Password</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#1b75bc] text-white font-semibold hover:bg-[#155a94] disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
