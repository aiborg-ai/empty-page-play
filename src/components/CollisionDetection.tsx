import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  FileText,
  Eye,
  Search,
  Download,
  Bell
} from 'lucide-react';
import { PatentCollisionDetector } from '../lib/collisionDetection';
import type { PatentCollisionAlert } from '../types/innovations';

interface CollisionDetectionProps {
  currentUser: any;
  projectId?: string;
}

export default function CollisionDetection({ currentUser: _currentUser, projectId: _projectId }: CollisionDetectionProps) {
  const [alerts, setAlerts] = useState<PatentCollisionAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [claims, setClaims] = useState<string[]>(['']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priorArtAnalysis, setPriorArtAnalysis] = useState<any>(null);
  const [invalidityReport, setInvalidityReport] = useState<any>(null);
  const [ftoAnalysis, setFtoAnalysis] = useState<any>(null);
  const [ftoTechnology, setFtoTechnology] = useState('');
  const [jurisdiction, setJurisdiction] = useState('US');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const detector = new PatentCollisionDetector();

  useEffect(() => {
    // Load existing alerts from localStorage
    const savedAlerts = localStorage.getItem('patent-collision-alerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const handleAddClaim = () => {
    setClaims([...claims, '']);
  };

  const handleRemoveClaim = (index: number) => {
    setClaims(claims.filter((_, i) => i !== index));
  };

  const handleUpdateClaim = (index: number, value: string) => {
    setClaims(claims.map((claim, i) => i === index ? value : claim));
  };

  const handleAnalyzeCollisions = async () => {
    if (!analysisText.trim()) {
      alert('Please enter patent text to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const validClaims = claims.filter(claim => claim.trim());
      const collisionAlerts = await detector.detectCollisions(
        analysisText,
        validClaims,
        `temp_patent_${Date.now()}`
      );

      const newAlerts = [...alerts, ...collisionAlerts];
      setAlerts(newAlerts);
      localStorage.setItem('patent-collision-alerts', JSON.stringify(newAlerts));
    } catch (error) {
      alert(`Failed to analyze collisions: ${error}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartMonitoring = async () => {
    if (!analysisText.trim()) {
      alert('Please enter patent text to monitor');
      return;
    }

    const patents = [{
      id: `monitored_patent_${Date.now()}`,
      text: analysisText,
      claims: claims.filter(claim => claim.trim())
    }];

    try {
      await detector.startRealTimeMonitoring(patents, (newAlerts) => {
        setAlerts(prev => {
          const updated = [...prev, ...newAlerts];
          localStorage.setItem('patent-collision-alerts', JSON.stringify(updated));
          return updated;
        });
      });
      setIsMonitoring(true);
    } catch (error) {
      alert(`Failed to start monitoring: ${error}`);
    }
  };

  const handleStopMonitoring = () => {
    detector.stopRealTimeMonitoring();
    setIsMonitoring(false);
  };

  const handleAnalyzePriorArt = async () => {
    if (!analysisText.trim()) {
      alert('Please enter patent text');
      return;
    }

    try {
      const validClaims = claims.filter(claim => claim.trim());
      const analysis = await detector.analyzePriorArt(analysisText, validClaims);
      setPriorArtAnalysis(analysis);
    } catch (error) {
      alert(`Failed to analyze prior art: ${error}`);
    }
  };

  const handleGenerateInvalidityReport = async () => {
    if (!analysisText.trim() || !priorArtAnalysis?.priorArt?.length) {
      alert('Please analyze prior art first');
      return;
    }

    try {
      const validClaims = claims.filter(claim => claim.trim());
      const report = await detector.generateInvalidityReport(
        `temp_patent_${Date.now()}`,
        validClaims,
        priorArtAnalysis.priorArt
      );
      setInvalidityReport(report);
    } catch (error) {
      alert(`Failed to generate invalidity report: ${error}`);
    }
  };

  const handleFreedomToOperate = async () => {
    if (!ftoTechnology.trim()) {
      alert('Please enter technology description');
      return;
    }

    try {
      const analysis = await detector.checkFreedomToOperate(ftoTechnology, jurisdiction);
      setFtoAnalysis(analysis);
    } catch (error) {
      alert(`Failed to analyze Freedom to Operate: ${error}`);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCollisionTypeColor = (type: string) => {
    switch (type) {
      case 'exact_match': return 'text-red-700 bg-red-50 border-red-200';
      case 'substantial_overlap': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'potential_conflict': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const filteredAlerts = filterSeverity === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filterSeverity);

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patent Collision Detection</h1>
              <p className="text-gray-600">Real-time monitoring and analysis of patent conflicts</p>
            </div>
            <div className="ml-auto flex gap-2">
              {isMonitoring ? (
                <button
                  onClick={handleStopMonitoring}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Bell className="w-4 h-4" />
                  Stop Monitoring
                </button>
              ) : (
                <button
                  onClick={handleStartMonitoring}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Bell className="w-4 h-4" />
                  Start Monitoring
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Analysis Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Patent Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Patent Analysis</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patent Description
                  </label>
                  <textarea
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter patent description or claims text..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claims
                  </label>
                  {claims.map((claim, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={claim}
                        onChange={(e) => handleUpdateClaim(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={`Claim ${index + 1}...`}
                        rows={2}
                      />
                      <button
                        onClick={() => handleRemoveClaim(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddClaim}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    + Add Claim
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyzeCollisions}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Analyze Collisions
                  </button>
                  
                  <button
                    onClick={handleAnalyzePriorArt}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4" />
                    Analyze Prior Art
                  </button>
                </div>
              </div>
            </div>

            {/* Freedom to Operate Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Freedom to Operate Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Description
                  </label>
                  <input
                    type="text"
                    value={ftoTechnology}
                    onChange={(e) => setFtoTechnology(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the technology to analyze..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jurisdiction
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="EU">European Union</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleFreedomToOperate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Eye className="w-4 h-4" />
                Analyze Freedom to Operate
              </button>

              {ftoAnalysis && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {ftoAnalysis.clearToOperate ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      ftoAnalysis.clearToOperate ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {ftoAnalysis.clearToOperate ? 'Clear to Operate' : 'Potential Conflicts'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      ftoAnalysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      ftoAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ftoAnalysis.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  
                  {ftoAnalysis.blockingPatents?.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Blocking Patents:</div>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {ftoAnalysis.blockingPatents.map((patent: string, index: number) => (
                          <li key={index}>{patent}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {ftoAnalysis.recommendations?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Recommendations:</div>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {ftoAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prior Art Analysis Results */}
            {priorArtAnalysis && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Prior Art Analysis</h2>
                  <button
                    onClick={handleGenerateInvalidityReport}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Invalidity Report
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{priorArtAnalysis.strengthScore}</div>
                    <div className="text-sm text-blue-800">Strength Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{priorArtAnalysis.priorArt?.length || 0}</div>
                    <div className="text-sm text-green-800">Prior Art Found</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{priorArtAnalysis.invalidatingReferences?.length || 0}</div>
                    <div className="text-sm text-red-800">Invalidating Refs</div>
                  </div>
                </div>

                {priorArtAnalysis.priorArt?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Prior Art References</h3>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {priorArtAnalysis.priorArt.map((art: string, index: number) => (
                        <li key={index}>{art}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {priorArtAnalysis.invalidatingReferences?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-900 mb-2">Potentially Invalidating References</h3>
                    <ul className="text-sm text-red-600 list-disc list-inside">
                      {priorArtAnalysis.invalidatingReferences.map((ref: string, index: number) => (
                        <li key={index}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Invalidity Report */}
            {invalidityReport && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Invalidity Analysis Report</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{invalidityReport.invalidClaims?.length || 0}</div>
                    <div className="text-sm text-red-800">Invalid Claims</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{invalidityReport.validClaims?.length || 0}</div>
                    <div className="text-sm text-green-800">Valid Claims</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(invalidityReport.confidence * 100)}%</div>
                    <div className="text-sm text-blue-800">Confidence</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Analysis Report</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{invalidityReport.report}</p>
                </div>
              </div>
            )}
          </div>

          {/* Alerts Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Collision Alerts</h2>
              <div className="flex items-center gap-2">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No collision alerts</p>
                  <p className="text-sm">Run analysis to detect potential conflicts</p>
                </div>
              ) : (
                filteredAlerts.map((alert, _index) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getCollisionTypeColor(alert.collisionType)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.detectedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-medium mb-1">
                      {alert.collisionType.replace('_', ' ').toUpperCase()}
                    </h3>
                    <p className="text-sm mb-2">{alert.description}</p>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      Confidence: {Math.round(alert.confidenceScore * 100)}%
                    </div>

                    {alert.recommendedActions?.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Actions:</div>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {alert.recommendedActions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alert.similarPatents?.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-700 mb-1">Similar Patents:</div>
                        <div className="text-xs text-gray-600">
                          {alert.similarPatents.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}