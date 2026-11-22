import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  Quote,
  ChevronRight,
  Search,
  Sparkles,
  Send,
  MessageSquarePlus,
  ArrowRight,
} from 'lucide-react';
import { allReviews, type Review } from '../data/reviewsData';
import { useLanguage } from '../context/LanguageContext';

interface ReviewsPageProps {
  onNavigateHome: () => void;
  onNavigateToBooking: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  onNavigateHome,
  onNavigateToBooking,
}) => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(allReviews);

  // New Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newService, setNewService] = useState('Luchthavenvervoer');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);

  const categories = [
    'Alle',
    'Luchthavenvervoer',
    'Zakelijk vervoer',
    'Zorgvervoer',
    'Evenementenvervoer',
    'Lokaal taxivervoer',
  ];

  const filteredReviews = useMemo(() => {
    return reviewsList.filter((r) => {
      const matchesCategory =
        selectedFilter === 'Alle' ||
        r.service.toLowerCase().includes(selectedFilter.toLowerCase());
      const matchesQuery =
        searchQuery.trim() === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [reviewsList, selectedFilter, searchQuery]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;

    const initials = newName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const createdReview: Review = {
      id: Date.now(),
      name: newName,
      location: newLocation || 'Nederland',
      service: newService,
      rating: newRating,
      date: 'Zojuist geplaatst',
      text: newText,
      verified: true,
      avatarColor: 'bg-[#001331]',
      initials: initials || 'NL',
    };

    setReviewsList([createdReview, ...reviewsList]);
    setSubmittedReview(true);
    setTimeout(() => {
      setSubmittedReview(false);
      setShowReviewForm(false);
      setNewName('');
      setNewLocation('');
      setNewText('');
      setNewRating(5);
    }, 2000);
  };

  return (
    <div className="w-full">
      {/* Top Banner / Hero */}
      <section className="relative bg-gradient-to-br from-[#001331] via-[#001a3f] to-[#00255c] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200/80 mb-6">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#FFB800] transition cursor-pointer flex items-center gap-1"
            >
              {t('nav.home')}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FFB800] font-bold">{t('reviews.page.breadcrumb')}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('reviews.page.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t('reviews.page.h1')}
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
                {t('reviews.page.sub')}
              </p>
            </div>

            {/* Score Summary Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-white shrink-0 flex items-center gap-6">
              <div>
                <div className="text-4xl font-black text-[#FFB800]">4.9</div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <div className="text-xs text-blue-200 mt-1">{t('reviews.page.ratingsCount')}</div>
              </div>
              <div className="h-14 w-px bg-white/20"></div>
              <div className="space-y-1 text-xs text-blue-200">
                <div><span className="font-bold text-white">99.4%</span> {t('reviews.page.punctuality')}</div>
                <div><span className="font-bold text-white">98%</span> {t('reviews.page.recommends')}</div>
                <div><span className="font-bold text-white">100%</span> {t('reviews.page.verifiedLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-12">
        {/* Rating Breakdown & Write Review Action */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
            <span className="font-bold text-[#07152B] text-base">{t('reviews.page.scoreBreakdown')}</span>
            <div className="flex items-center gap-2">
              <span>{t('reviews.page.stars5')}</span>
              <div className="w-24 sm:w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFB800] rounded-full w-[94%]"></div>
              </div>
              <span className="font-bold text-xs">94%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('reviews.page.stars4')}</span>
              <div className="w-20 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-300 rounded-full w-[5%]"></div>
              </div>
              <span className="font-bold text-xs">5%</span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#001331] hover:bg-[#00255c] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#FFB800]" />
            <span>{showReviewForm ? t('reviews.page.closeForm') : t('reviews.page.writeReview')}</span>
          </button>
        </div>

        {/* Optional Review Form Drawer */}
        {showReviewForm && (
          <div className="bg-[#FAF8FE] border border-slate-200 rounded-3xl p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-[#07152B]">{t('reviews.page.shareTitle')}</h3>
                <p className="text-xs text-gray-500">
                  {t('reviews.page.shareSub')}
                </p>
              </div>

              {submittedReview ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <div className="font-bold text-base text-[#07152B]">{t('reviews.page.thankYou')}</div>
                  <p className="text-xs text-gray-600">{t('reviews.page.reviewAdded')}</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4 pt-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-gray-700">{t('reviews.page.yourRating')}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= newRating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{t('reviews.page.yourName')}</label>
                      <input
                        type="text"
                        required
                        placeholder={t('reviews.page.namePlaceholder')}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{t('reviews.page.city')}</label>
                      <input
                        type="text"
                        placeholder={t('reviews.page.cityPlaceholder')}
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t('reviews.page.serviceType')}</label>
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c] bg-white cursor-pointer"
                    >
                      <option value="Luchthavenvervoer">Luchthavenvervoer (Schiphol)</option>
                      <option value="Zakelijk vervoer">Zakelijk vervoer</option>
                      <option value="Zorgvervoer">Zorgvervoer</option>
                      <option value="Evenementenvervoer">Evenementenvervoer</option>
                      <option value="Lokaal taxivervoer">Lokaal taxivervoer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t('reviews.page.yourExperience')}</label>
                    <textarea
                      required
                      rows={3}
                      placeholder={t('reviews.page.experiencePlaceholder')}
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#001331] hover:bg-[#00255c] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#FFB800]" />
                    <span>{t('reviews.page.submitReview')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-[#001331] text-[#FFB800] shadow-md'
                    : 'bg-white text-gray-600 hover:bg-[#EBF2FC] hover:text-[#001331] border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('reviews.page.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00255c]"
            />
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs text-gray-500">
          {t('reviews.page.showing')} <span className="font-bold text-[#07152B]">{filteredReviews.length}</span> {t('reviews.page.of')} {reviewsList.length} {t('reviews.page.reviews')}
        </div>

        {/* Full Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#FFB800] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Rating & Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#EBF2FC] text-[#001331] flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <Quote className="w-4 h-4" />
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                  "{review.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${review.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}
                    >
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#07152B] tracking-tight flex items-center gap-1.5">
                        <span>{review.name}</span>
                        {review.verified && (
                          <span title="Geverifieerde reiziger">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {review.location} • {review.date}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-[#EBF2FC] text-[#00255c] text-[11px] font-bold shrink-0">
                    {review.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Book */}
        <section className="bg-gradient-to-r from-[#001331] to-[#00255c] rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">{t('reviews.page.ctaTitle')}</h2>
          <p className="text-sm sm:text-base text-blue-200 max-w-xl mx-auto">
            {t('reviews.page.ctaSub')}
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToBooking}
              className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-yellow-400 text-[#001331] font-black text-sm shadow-xl transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t('reviews.page.ctaBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
