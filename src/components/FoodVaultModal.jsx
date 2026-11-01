import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Search, 
  Star, 
  Flame, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Plus,
  Info
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audioDelight';
import { MASTER_DISH_CATALOG } from '../data/mockData';

export default function FoodVaultModal({ 
  isOpen, 
  onClose, 
  vaultIds, 
  onToggleVaultDish,
  onNotify 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all | protein | homestyle | light

  if (!isOpen) return null;

  const currentCount = vaultIds.length;
  const isFull = currentCount >= 20;

  const filteredDishes = MASTER_DISH_CATALOG.filter((dish) => {
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.kitchen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.tag.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && dish.category === selectedFilter;
  });

  const handleToggle = (dish) => {
    const isAlreadyIn = vaultIds.includes(dish.id);
    if (!isAlreadyIn && isFull) {
      playPop();
      if (onNotify) {
        onNotify('Vault Capacity Reached (20/20) ⚠️', 'Remove a dish from your vault to add a new favorite.', 'warning');
      }
      return;
    }

    playSuccessChime();
    onToggleVaultDish(dish.id);
    if (onNotify) {
      if (isAlreadyIn) {
        onNotify('Removed from Vault', `"${dish.name}" removed from your favorites.`, 'info');
      } else {
        onNotify('Added to Vault! 💖', `"${dish.name}" added to your 20-dish pool.`, 'success');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] border border-slate-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 px-5 pt-4 pb-3.5 text-white border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Curate My Food Vault</h3>
                <p className="text-[10px] text-slate-400">Approved dishes auto-rotated in your weekly plan</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar of 20 Items */}
          <div className="mt-3 bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-slate-300">Vault Capacity</span>
              <span className={`font-black ${isFull ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentCount} / 20 Dishes
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-300 ${isFull ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${(currentCount / 20) * 100}%` }}
              />
            </div>
            {currentCount < 5 && (
              <p className="text-[10px] text-amber-300 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Add at least 5 dishes for a full Monday–Friday zero-repeat rotation.
              </p>
            )}
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="p-3 bg-white border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              inputMode="search"
              aria-label="Search dishes, kitchens, or ingredients"
              placeholder="Search dishes, kitchens, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-[16px] sm:text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'all', label: 'All Dishes' },
              { id: 'protein', label: '🏋️ High-Protein' },
              { id: 'homestyle', label: '🥘 Homestyle' },
              { id: 'light', label: '🥗 Salads & Bowls' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  playPop();
                  setSelectedFilter(f.id);
                }}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  selectedFilter === f.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dish List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredDishes.map((dish) => {
            const isInVault = vaultIds.includes(dish.id);
            return (
              <div 
                key={dish.id}
                className={`rounded-xl p-3 border-2 transition-all flex items-center justify-between gap-3 ${
                  isInVault
                    ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="text-2xl shrink-0 p-1 bg-slate-50 rounded-lg">{dish.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h4>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold shrink-0">
                        {dish.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                      <span className="font-medium text-slate-700 truncate">{dish.kitchen}</span>
                      <span>•</span>
                      <span className="flex items-center font-bold text-amber-600">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {dish.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="font-extrabold text-slate-900">₹{dish.price}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{dish.kcal} kcal</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-amber-700 flex items-center">
                        <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500 mr-0.5" />
                        {dish.protein}g protein
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Tap Toggle Button */}
                <button
                  onClick={() => handleToggle(dish)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 shrink-0 ${
                    isInVault
                      ? 'bg-rose-500 text-white shadow-xs'
                      : isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-rose-400 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isInVault ? 'fill-white text-white' : 'text-slate-500'}`} />
                  <span>{isInVault ? 'In Vault' : 'Add'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-600">
            <strong>{currentCount} of 20</strong> favorites selected
          </div>
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            Done & Update Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
