import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { cn } from '../../../lib/utils';

interface FilterSidebarProps {
  show: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const CATEGORIES = [
  'All Services',
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Gardening',
  'Moving',
  'Painting',
  'Repairs',
  'Other'
];

export function FilterSidebar({
  show,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:sticky top-0 right-0 md:left-auto h-full md:h-auto w-80 md:bg-transparent z-50 md:z-0 transform",
          show ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        <div className="glass-card p-6 mt-24">
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 md:hidden"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <h2 className="text-xl font-semibold mb-6">Filters</h2>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category === 'All Services' ? null : category)}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-lg transition-colors",
                    (category === 'All Services' && !selectedCategory) || category === selectedCategory
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 