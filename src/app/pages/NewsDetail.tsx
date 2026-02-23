import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { newsApi, NewsArticle } from '../utils/api';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const data = await newsApi.getById(id);
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load article');
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="pt-[85px] pb-20">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Link to="/news" className="inline-flex items-center gap-2 text-[#1b75bc] font-bold hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>
        </div>

        {loading ? (
          <section className="max-w-5xl mx-auto px-8 py-10 text-gray-600">Loading article...</section>
        ) : error || !article ? (
          <section className="max-w-5xl mx-auto px-8 py-10 text-red-600">
            {error || 'Article not found'}
          </section>
        ) : (
          <article className="max-w-5xl mx-auto px-8">
            <div className="rounded-2xl overflow-hidden h-[420px] bg-gray-200 mb-8">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-6 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{article.author}</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-[#324048] mb-6">{article.title}</h1>
            <p className="text-xl text-gray-700 leading-relaxed">{article.content}</p>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
