# Capability Category Mapping

This document maps all capability cards to their respective categories in the InnoSpot platform. Update this file to reorganize capabilities, then the system will update the Supabase database accordingly.

## Category Definitions

- **ai** → AI Agents
- **analysis** → Tools  
- **visualization** → Datasets
- **search** → Reports
- **automation** → Dashboards
- **mcp** → MCP Integrations

---

## Current Capability Mappings

### AI Agents (category: 'ai')
1. **AI Patent Landscape Analyzer** (id: 1) - AI-powered patent landscape analysis
2. **AI Opportunity Gap Scanner** (id: opportunity-gap-scanner) - Identify market opportunities using AI
3. **AI Patent Claim Generator 2.0** (id: ai-patent-claims-2) - Next-gen patent claim drafting
4. **AI Prior Art Oracle** (id: prior-art-oracle) - Conceptual prior art search
5. **AI Innovation Trajectory Predictor** (id: trajectory-predictor) - Predict innovation paths
6. **AI Portfolio Optimization** (id: innovation-portfolio-optimization) - Portfolio analysis and recommendations
7. **AI-Powered Licensing Marketplace** (id: innovation-licensing-marketplace) - Patent licensing platform

### Tools (category: 'analysis')
1. **Patent Citation Network Mapper** (id: 2) - Citation network visualization
2. **Automated Patent Summarizer** (id: 3) - AI-powered document summarization
3. **Deep Dive Innovation Analyzer** (id: 6) - Innovation pattern analysis
4. **AI Patent Claim Generator** (id: innovation-ai-claim-generator) - Generate patent claims
6. **3D Citation Network Visualization** (id: innovation-citation-3d) - 3D patent relationships
7. **Blockchain Patent Provenance** (id: innovation-blockchain-provenance) - Blockchain tracking
8. **Collaborative Patent Workspace** (id: innovation-collaborative-review) - Team collaboration
9. **Market Intelligence Bridge** (id: innovation-market-intelligence) - Patent-market connection
10. **Automated Landscape Monitoring** (id: innovation-landscape-monitoring) - Landscape tracking
1. **Technology Trends Report Generator** (id: 5) - Automated trend reports


### Datasets (category: 'visualization')
1. **PatentsView Dataset** (id: uspto-patentsview) - USPTO patent data
2. **AI Patent Dataset (AIPD)** (id: uspto-ai-patent-dataset) - AI-related patents
3. **Patent Assignment Dataset** (id: uspto-patent-assignment) - Ownership transfers
5. **Trademark Case Files Dataset** (id: uspto-trademark-case-files) - Trademark data
6. **Patent Examination Research Dataset (PatEx)** (id: uspto-patex) - Examination history
7. **Trademark Assignment Dataset** (id: uspto-trademark-assignment) - Trademark ownership

### Reports (category: 'search')

2. **Quantum Computing Patent Landscape Report** (id: report-quantum-computing)
3. **Green Hydrogen Technology Insight Report** (id: report-green-hydrogen)
4. **Autonomous Vehicle Technology Report** (id: report-autonomous-vehicles)
5. **mRNA Vaccine Technology Patent Report** (id: report-mrna-vaccines)
6. **6G Wireless Technology Forecast Report** (id: report-6g-wireless)
7. **Carbon Capture & Storage Patent Report** (id: report-carbon-capture)
8. **Neuromorphic Computing Patent Landscape** (id: report-neuromorphic-computing)
9. **Solid-State Battery Technology Report** (id: report-solid-state-batteries)
10. **Synthetic Biology Patent Intelligence Report** (id: report-synthetic-biology)
11. **Photonics & Optical Computing Report** (id: report-photonics-computing)
12. **Digital Therapeutics Patent Report** (id: report-digital-therapeutics)
13. **Agricultural Robotics & AgTech Patent Report** (id: report-agricultural-robotics)
14. **Space Technology & Satellite Patent Report** (id: report-space-technology)
15. **Edge Computing & IoT Patent Intelligence** (id: report-edge-computing)
16. **Blockchain in Supply Chain Patent Report** (id: report-blockchain-supply-chain)
17. **Metamaterials & Advanced Materials Report** (id: report-metamaterials)
18. **Circular Economy Technology Patent Report** (id: report-circular-economy)
19. **Brain-Computer Interface Patent Landscape** (id: report-brain-computer-interface)
20. **Fusion Energy Technology Patent Report** (id: report-fusion-energy)
21. **3D Printing & Additive Manufacturing Report** (id: report-additive-manufacturing)
4. **Patent Litigation Docket Reports** (id: uspto-litigation-docket) - Litigation data
5. **Real-Time Collision Detection** (id: innovation-collision-detection) - Patent conflict monitoring

### Dashboards (category: 'automation')
1. **Global Patent Dataset Explorer** (id: 4) - Global patent records with filtering

### MCP Integrations (category: 'mcp')
1. **InnoSpot MCP Integration** (id: mcp-innospot-1) - Patent intelligence MCP server

---

## Instructions for Updating

### To reassign a capability to a different category:

1. Find the capability in the list above
2. Move it to the desired category section
3. Update the category value in parentheses
4. Save this file

### Category Values:
- Use `'ai'` for AI Agents
- Use `'analysis'` for Tools
- Use `'visualization'` for Datasets
- Use `'search'` for Reports  
- Use `'automation'` for Dashboards
- Use `'mcp'` for MCP Integrations

### Example:
To move "Global Patent Dataset Explorer" from Dashboards to Datasets:
1. Move the entry from "Dashboards" section to "Datasets" section
2. Change `(category: 'automation')` to `(category: 'visualization')`

### After Updating:
Once you've made your changes to this file, the system will:
1. Update the mockCapabilities.ts file
2. Update the Supabase database accordingly
3. Reflect changes in the UI immediately

---

## Notes

- The `type` field is automatically determined based on the category
- Some capabilities may have additional metadata that will be preserved during updates
- All capabilities are initially set as available and not purchased (for demo purposes)
- Pricing and other attributes remain unchanged when reassigning categories

---

*Last Updated: 2025-08-12*
