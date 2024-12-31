'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COMPANIES } from './data';

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = COMPANIES.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Companies</h1>
        
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/dsa/companies/${company.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-24 mb-4">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h2>
                  <p className="text-gray-600">{company.problems.length} Problems</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 