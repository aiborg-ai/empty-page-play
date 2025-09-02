import React, { useState } from 'react';
import { Download } from 'lucide-react';

const PatentLandscapeGenerator: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patent Landscape Generator</h1>
          <p className="text-gray-600 mt-2">One-click comprehensive patent landscape reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configure Report</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technology Domain</label>
                  <input
                    type="text"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Artificial Intelligence, Battery Technology"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Last 5 years</option>
                      <option>Last 10 years</option>
                      <option>All time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdictions</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Global</option>
                      <option>US + EU + CN</option>
                      <option>US Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Components</label>
                  <div className="space-y-2">
                    {['Technology Clustering', 'Key Players Analysis', 'Trend Analysis', 'Citation Networks', 'Geographic Distribution'].map(component => (
                      <label key={component} className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded mr-2" />
                        <span className="text-sm text-gray-700">{component}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {generating ? 'Generating Report...' : 'Generate Landscape Report'}
                </button>
              </div>

              {!generating && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">Sample Report Ready</p>
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="text-sm text-gray-700">Patents Analyzed: 12,456</span>
                      <span className="text-sm font-medium text-gray-900">100%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="text-sm text-gray-700">Key Players Identified: 234</span>
                      <span className="text-sm font-medium text-gray-900">100%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="text-sm text-gray-700">Technology Clusters: 18</span>
                      <span className="text-sm font-medium text-gray-900">100%</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Full Report (PDF)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {[
                  { title: 'AI in Healthcare', date: '2025-08-10', pages: 48 },
                  { title: 'Quantum Computing', date: '2025-08-05', pages: 36 },
                  { title: 'Green Energy Tech', date: '2025-07-28', pages: 52 }
                ].map((report, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                        <p className="text-xs text-gray-500">{report.date} • {report.pages} pages</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reports Generated</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Patents Analyzed</span>
                  <span className="font-medium">1.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Generation Time</span>
                  <span className="font-medium">45s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentLandscapeGenerator;