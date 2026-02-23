import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { newsApi, newsletterApi, NewsArticle } from '../utils/api';

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await newsApi.getAll({ page: 1, limit: 12 });
        setArticles(result.articles);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load news';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const featuredNews = useMemo(() => articles[0], [articles]);
  const recentArticles = useMemo(() => articles.slice(1), [articles]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeMessage('');
    try {
      const result = await newsletterApi.subscribe(email);
      setSubscribeMessage(result.message);
      setEmail('');
    } catch (err) {
      setSubscribeMessage(err instanceof Error ? err.message : 'Subscription failed');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-[85px] pb-20">
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="max-w-7xl mx-auto px-8 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Latest News</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Stay updated with the latest developments and insights from Telente Logistics.
            </p>
          </div>
        </section>

        {loading ? (
          <section className="py-20 max-w-7xl mx-auto px-8 text-center text-gray-600">
            Loading news...
          </section>
        ) : error ? (
          <section className="py-20 max-w-7xl mx-auto px-8 text-center text-red-600">{error}</section>
        ) : (
          <>
            {featuredNews ? (
              <section className="py-20 max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="bg-gray-200 rounded-2xl h-[400px] overflow-hidden">
                    <img
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(featuredNews.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span>{featuredNews.author}</span>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold text-[#324048] mb-4">{featuredNews.title}</h2>
                    <p className="text-xl text-gray-700 mb-6">{featuredNews.excerpt}</p>
                    <Link
                      to={`/news/${featuredNews.id}`}
                      className="inline-flex items-center gap-2 bg-[#1b75bc] text-white px-6 py-3 rounded-full font-bold hover:bg-[#155a94] transition-colors"
                    >
                      Read Full Article
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-4xl font-bold text-[#324048] mb-4 text-center">Recent Articles</h2>
                <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="bg-gray-200 h-[200px] overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#324048] mb-3">{article.title}</h3>
                        <p className="text-gray-700 mb-4">{article.excerpt}</p>
                        <Link
                          to={`/news/${article.id}`}
                          className="text-[#1b75bc] font-bold hover:underline inline-flex items-center gap-2"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="py-20 max-w-4xl mx-auto px-8">
          <div className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-xl mb-8">Get the latest updates delivered directly to your inbox.</p>
            <form className="flex gap-4 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#2E4049] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f2c32] transition-colors"
              >
                Subscribe
              </button>
            </form>
            {subscribeMessage ? <p className="mt-4 text-sm">{subscribeMessage}</p> : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
