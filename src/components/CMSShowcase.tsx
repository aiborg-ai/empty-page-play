import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  TrendingUp,
  ChevronDown,
  Eye,
  Play,
  Settings
} from 'lucide-react';
import { CMSService } from '../lib/cmsService';
import type { Content, Category } from '../types/cms';
import HarmonizedCard, { HCLStat, HCLKeyword, HCLAttribute, HCLAction } from './HarmonizedCard';

interface CMSShowcaseProps {
  onNavigate?: (section: string) => void;
  initialCategory?: string;
}

export default function CMSShowcase({ initialCategory = 'all' }: CMSShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [showcaseItems, setShowcaseItems] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const cms = CMSService.getInstance();

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const categoriesResponse = await cms.getCategories();
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      // Load showcase items (published content of type 'showcase-item')
      const contentsResponse = await cms.getContents({
        status: 'published',
        content_type: 'showcase-item',
        per_page: 50
      });
      
      if (contentsResponse.data) {
        setShowcaseItems(contentsResponse.data);
      }
    } catch (error) {
      console.error('Error loading showcase data:', error);
      // If CMS fails, show some default items or fallback UI
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let filtered = showcaseItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category?.slug === selectedCategory || 
        item.data?.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.data?.features?.some((f: string) => f.toLowerCase().includes(query)) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [showcaseItems, selectedCategory, searchQuery]);

  // Convert CMS content to HCL format
  const convertToHCL = (item: Content) => {
    const data = item.data || {};
    
    const stats: HCLStat[] = [];
    
    // Add pricing info if available
    if (data.pricing?.starting_price) {
      stats.push({
        label: 'Starting at',
        value: `$${data.pricing.starting_price}`,
        icon: TrendingUp,
        color: 'text-green-600'
      });
    }

    // Add provider info
    if (data.provider) {
      stats.push({
        label: 'Provider',
        value: data.provider,
        icon: Users,
        color: 'text-blue-600'
      });
    }

    // Add view count
    if (item.view_count > 0) {
      stats.push({
        label: 'Views',
        value: item.view_count,
        icon: Eye,
        color: 'text-gray-600'
      });
    }

    // Keywords from features and tags
    const keywords: HCLKeyword[] = [];
    
    // Add features as keywords
    if (data.features && Array.isArray(data.features)) {
      data.features.slice(0, 3).forEach((feature: string) => {
        keywords.push({
          label: feature,
          color: 'blue'
        });
      });
    }

    // Add tags
    if (item.tags) {
      item.tags.slice(0, 3).forEach(tag => {
        keywords.push({
          label: tag,
          color: 'gray'
        });
      });
    }

    // Attributes
    const attributes: HCLAttribute[] = [];
    
    if (data.version) {
      attributes.push({
        label: 'Version',
        value: data.version,
        icon: Settings
      });
    }

    if (item.published_at) {
      attributes.push({
        label: 'Published',
        value: new Date(item.published_at).toLocaleDateString(),
        icon: Clock
      });
    }

    // Actions
    const actions: HCLAction[] = [];

    // Primary action - View/Try
    if (data.demo_url) {
      actions.push({
        id: 'try',
        label: 'Try Demo',
        icon: Play,
        onClick: () => window.open(data.demo_url, '_blank'),
        variant: 'primary',
        isPrimary: true
      });
    } else {
      actions.push({
        id: 'view',
        label: 'View Details',
        icon: Eye,
        onClick: () => handleViewItem(item),
        variant: 'primary',
        isPrimary: true
      });
    }

    // Secondary actions
    actions.push({
      id: 'star',
      label: 'Add to Favorites',
      icon: Star,
      onClick: () => handleStarItem(item),
      variant: 'secondary'
    });

    return {
      title: item.title,
      description: item.excerpt || 'No description available',
      stats,
      keywords,
      attributes,
      actions,
      colorAccent: item.category?.color || '#3b82f6'
    };
  };

  const handleViewItem = (item: Content) => {
    console.log('Viewing item:', item.title);
    // TODO: Implement item detail view
  };

  const handleStarItem = (item: Content) => {
    console.log('Starring item:', item.title);
    // TODO: Implement favorites functionality
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading showcase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Showcase</h1>
            <p className="text-sm text-gray-600 mt-1">
              Discover tools, AI agents, and capabilities for your research
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredItems.length} of {showcaseItems.length} items
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Category
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[200px]">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    selectedCategory === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.slug)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
                      selectedCategory === category.slug ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No items match "${searchQuery}". Try adjusting your search terms.`
                : `No items available in this category.`
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const hclProps = convertToHCL(item);
              return (
                <HarmonizedCard
                  key={item.id}
                  {...hclProps}
                  className="h-full"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}