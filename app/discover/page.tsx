"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, Users, X, GraduationCap, CalendarClock, Building2 } from 'lucide-react';
import DiscoverPeople from '@/components/discover-people';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science and Engineering',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electrical Engineering',
];

const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const BATCHES = ['All Batches', '2020', '2021', '2022', '2023', '2024'];

export default function DiscoverPage() {
  const [filters, setFilters] = useState({
    search: '',
    department: 'All Departments',
    year: 'All Years',
    batch: 'All Batches',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      department: 'All Departments',
      year: 'All Years',
      batch: 'All Batches',
    });
  };

  const hasActiveFilters = (
    filters.department !== 'All Departments' ||
    filters.year !== 'All Years' ||
    filters.batch !== 'All Batches'
  );

  const activeFilterCount = [
    filters.department !== 'All Departments',
    filters.year !== 'All Years',
    filters.batch !== 'All Batches'
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative p-6 md:p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Discover Students
            </h1>
            <p className="text-white/80 text-lg">
              Connect with fellow students, build your network, and discover new opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or registration number"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-9 h-11 w-full"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => handleFilterChange('search', '')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:w-auto h-11 gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your search with these filters
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label>Department</Label>
                  </div>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => handleFilterChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <Label>Year</Label>
                  </div>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => handleFilterChange('year', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <Label>Batch</Label>
                  </div>
                  <Select
                    value={filters.batch}
                    onValueChange={(value) => handleFilterChange('batch', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BATCHES.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                          {batch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="flex flex-row gap-3 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1"
                  disabled={!hasActiveFilters}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.department !== 'All Departments' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.department}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleFilterChange('department', 'All Departments')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.year !== 'All Years' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.year}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleFilterChange('year', 'All Years')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.batch !== 'All Batches' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.batch}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleFilterChange('batch', 'All Batches')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Results */}
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Students</h2>
            </div>
            <TabsList>
              <TabsTrigger value="grid" className="px-3">
                <div className="grid grid-cols-3 gap-0.5 h-4 w-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" />
                  ))}
                </div>
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <div className="flex flex-col gap-0.5 h-4 w-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-current h-[3px] w-full rounded-sm" />
                  ))}
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-0">
            <DiscoverPeople filters={filters} view="grid" />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <DiscoverPeople filters={filters} view="list" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}