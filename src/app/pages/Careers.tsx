import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Briefcase, MapPin, Clock, DollarSign, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { careerApi, JobPosting } from '../utils/api';

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const jobs = await careerApi.getAll();
        setJobPostings(jobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-[85px] pb-20">
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="max-w-7xl mx-auto px-8 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Build your career with a logistics team focused on quality service and continuous growth.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-[#324048] text-center mb-4">Open Positions</h2>
            <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>

            {loading ? (
              <p className="text-center text-gray-600">Loading open roles...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : (
              <div className="space-y-6">
                {jobPostings.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#324048] mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                          {job.salary ? (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                        className="bg-[#1b75bc] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#155a94] transition-colors whitespace-nowrap"
                      >
                        {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    {selectedJob === job.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="mb-6">
                          <h4 className="text-xl font-bold text-[#324048] mb-3">Job Description</h4>
                          <p className="text-gray-700">{job.description}</p>
                        </div>
                        <div className="mb-6">
                          <h4 className="text-xl font-bold text-[#324048] mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-[#1b75bc] mt-1">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <ApplicationForm jobTitle={job.title} jobId={job.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface ApplicationFormProps {
  jobTitle: string;
  jobId: string;
}

function ApplicationForm({ jobTitle, jobId }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await careerApi.apply(jobId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        resumeFileName: formData.resume?.name || '',
      });
      alert(result.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: '',
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : `Failed to submit application for ${jobTitle}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="text-xl font-bold text-[#324048] mb-4 flex items-center gap-2">
        <Send className="w-5 h-5" />
        Apply for this Position
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Resume/CV *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
            required
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
          />
          <p className="text-sm text-gray-600 mt-1">Resume file name is included in the application payload.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter</label>
          <textarea
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
            placeholder="Tell us why you're interested in this position..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1b75bc] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#155a94] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
