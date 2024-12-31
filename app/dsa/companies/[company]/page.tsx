'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COMPANIES } from '../data';

interface CompanyPageProps {
  params: {
    company: string;
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const company = COMPANIES.find(c => c.id === params.company);

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <Link href="/dsa/companies" className="text-blue-600 hover:text-blue-800">
            Return to Companies
          </Link>
        </div>
      </div>
    );
  }

  const filteredProblems = company.problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dsa/companies" className="text-blue-600 hover:text-blue-800">
            ← Back to Companies
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 relative">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <p className="text-gray-600">{company.problems.length} Problems</p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/dsa/problems/${problem.id}`} className="text-blue-600 hover:text-blue-800">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{problem.acceptance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 