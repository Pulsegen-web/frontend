import { useState, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy?: 'date' | 'title' | 'views' | 'size';
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  filters?: {
    status?: string[];
    visibility?: string[];
  };
  onFiltersChange?: (filters: any) => void;
  placeholder?: string;
  className?: string;
}

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'title', label: 'Title' },
  { value: 'views', label: 'Views' },
  { value: 'size', label: 'File Size' },
];

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
  { value: 'uploading', label: 'Uploading' },
];

const visibilityOptions = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
];

export function SearchFilters({
  searchTerm,
  onSearchChange,
  sortBy = 'date',
  sortOrder = 'desc',
  onSortChange,
  filters = {},
  onFiltersChange,
  placeholder = "Search...",
  className
}: SearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status?.length) count += filters.status.length;
    if (filters.visibility?.length) count += filters.visibility.length;
    return count;
  }, [filters]);

  const handleFilterChange = useCallback((type: string, value: string) => {
    if (!onFiltersChange) return;
    
    const currentFilters = filters[type as keyof typeof filters] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFiltersChange({
      ...filters,
      [type]: newFilters
    });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange({});
    }
  }, [onFiltersChange]);

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-9 h-9 sm:h-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {}
        {onSortChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 sm:h-10 px-2 sm:px-3">
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                <span className="hidden sm:ml-2 sm:inline">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value, sortOrder)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {sortBy === option.value && (
                    sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}>
                Toggle Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {}
        {onFiltersChange && (
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 sm:h-10 px-2 sm:px-3 relative">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel className="p-0">Filters</DropdownMenuLabel>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              
              {}
              <div className="p-2">
                <div className="text-xs font-medium mb-2 text-muted-foreground">Status</div>
                <div className="space-y-1">
                  {statusOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(option.value) || false}
                        onChange={() => handleFilterChange('status', option.value)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {}
              <div className="p-2">
                <div className="text-xs font-medium mb-2 text-muted-foreground">Visibility</div>
                <div className="space-y-1">
                  {visibilityOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.visibility?.includes(option.value) || false}
                        onChange={() => handleFilterChange('visibility', option.value)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status?.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="text-xs">
              Status: {statusOptions.find(s => s.value === status)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange('status', status)}
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {filters.visibility?.map((visibility) => (
            <Badge key={`visibility-${visibility}`} variant="secondary" className="text-xs">
              Visibility: {visibilityOptions.find(v => v.value === visibility)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange('visibility', visibility)}
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}