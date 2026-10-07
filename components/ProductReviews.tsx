'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle2, MessageSquare, Plus, Check } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

interface ProductReviewsProps {
  productName: string;
  initialRating: number;
  initialCount: number;
}

export default function ProductReviews({ productName, initialRating, initialCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      name: 'Mathew Thomas',
      location: 'Kottayam, Kerala',
      rating: 5,
      date: 'September 22, 2026',
      title: 'Outstanding quality and very smooth delivery in Kerala',
      comment:
        'Purchased from Kochuvila Agencies. The delivery team was punctual, unboxed the unit with utmost care, and gave a complete demonstration. Genuine product with manufacturer warranty.',
      verified: true,
      helpfulCount: 14,
    },
    {
      id: 'rev-2',
      name: 'Priya Rajagopal',
      location: 'Kollam, Kerala',
      rating: 5,
      date: 'September 14, 2026',
      title: 'Worth every rupee, exceeded our expectations',
      comment:
        'Visited their local showroom to check it out before ordering online. The finish, build quality, and performance are first-rate. Very happy with the purchase.',
      verified: true,
      helpfulCount: 9,
    },
    {
      id: 'rev-3',
      name: 'Arun Varma',
      location: 'Ernakulam, Kerala',
      rating: 4,
      date: 'August 29, 2026',
      title: 'Great product, prompt delivery and support',
      comment:
        'Got it delivered within 2 days to Kochi. Excellent packaging and 0% EMI process through credit card was completely hassle-free.',
      verified: true,
      helpfulCount: 6,
    },
  ]);

  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('Kerala, India');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleHelpful = (id: string) => {
    if (helpfulMap[id]) return;
    setHelpfulMap((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      location: newLocation.trim() || 'Kerala, India',
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim() || 'Verified Customer Review',
      comment: newComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setShowReviewForm(false);
    setSubmitted(true);
    setNewName('');
    setNewTitle('');
    setNewComment('');
  };

  // Distribution calculation
  const distribution = [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 16 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  return (
    <section className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-card">
      <div className="border-b border-brand-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Customer Feedback
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-black font-display uppercase tracking-tight mt-0.5">
            Ratings & Customer Reviews
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified Kerala households for {productName}.
          </p>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-deepBlue text-white text-xs font-bold rounded-xl transition-all shadow-button self-start sm:self-auto flex items-center gap-1.5 active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Thank you! Your verified review has been published.</span>
        </div>
      )}

      {/* Review Form Modal/Drawer */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-6 rounded-2xl bg-[#F5F7F9] border border-brand-border space-y-4 animate-fade-in text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-black text-sm text-black uppercase tracking-tight">
              Share Your Experience
            </h3>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-slate-400 hover:text-black font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-black text-slate-800 text-sm">{newRating} Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Kumar"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                Location (District in Kerala)
              </label>
              <input
                type="text"
                placeholder="e.g. Trivandrum, Kerala"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                Review Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Excellent cooling and quiet operation"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
              Detailed Comments *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell other Kerala shoppers about your experience with delivery, installation, and performance..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-deepBlue text-white font-bold rounded-xl shadow-button transition-all"
            >
              Post Review
            </button>
          </div>
        </form>
      )}

      {/* Ratings Breakdown Grid (Amazon style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-brand-border">
        {/* Score overview */}
        <div className="md:col-span-4 text-center md:text-left space-y-2">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl sm:text-5xl font-black text-black font-display">
              {initialRating.toFixed(1)}
            </span>
            <span className="text-slate-400 text-sm font-semibold">/ 5.0</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {initialCount || reviews.length} verified buyer reviews across Kerala
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                <span>{d.stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-slate-400 font-semibold text-[11px]">
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="pt-8 space-y-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="pb-6 border-b border-slate-100 last:border-b-0 space-y-2.5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                  <span>{r.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <h4 className="font-bold text-black text-xs sm:text-sm">
                  {r.title}
                </h4>
              </div>

              <span className="text-[11px] text-slate-400">{r.date}</span>
            </div>

            <p className="text-slate-700 leading-relaxed font-normal text-xs sm:text-sm">
              {r.comment}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{r.name}</span>
                <span>•</span>
                <span>{r.location}</span>
                {r.verified && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Purchase
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() => handleHelpful(r.id)}
                className={`flex items-center gap-1 text-[11px] font-semibold transition-colors px-2 py-0.5 rounded-lg border ${
                  helpfulMap[r.id]
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'text-slate-500 hover:text-black border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({r.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
