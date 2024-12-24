"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import DiscoverPeople from '@/components/discover-people';

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Discover Students
        </h1>
        <p className="text-muted-foreground mt-2">
          Connect with fellow students at SRM University AP
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or reg. number"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
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

        <div className="space-y-2">
          <Label>Year</Label>
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

        <div className="space-y-2">
          <Label>Batch</Label>
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

      <DiscoverPeople filters={filters} />
    </div>
  );
}