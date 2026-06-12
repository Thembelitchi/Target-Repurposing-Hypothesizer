// ============================================================================
// BIOGRAPHAI NEO4J KNOWLEDGE GRAPH SEEDING & ANALYSIS PIPELINE
// Standardized Cypher Blueprint for importing ChEMBL, OpenTargets & STRING-DB
// ============================================================================

// ----------------------------------------------------------------------------
// 1. DATABASE SCHEMA & CONSTRAINTS
// Ensure strict transactional atomicity and query optimization
// ----------------------------------------------------------------------------

CREATE CONSTRAINT unique_compound_id IF NOT EXISTS
FOR (c:Compound) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT unique_protein_id IF NOT EXISTS
FOR (p:Protein) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT unique_disease_id IF NOT EXISTS
FOR (d:Disease) REQUIRE d.id IS UNIQUE;

CREATE INDEX compound_name_index IF NOT EXISTS
FOR (c:Compound) REQUIRE c.name;

CREATE INDEX protein_symbol_index IF NOT EXISTS
FOR (p:Protein) REQUIRE p.symbol;

CREATE INDEX disease_name_index IF NOT EXISTS
FOR (d:Disease) REQUIRE d.name;

// ----------------------------------------------------------------------------
// 2. BULK DATA INGESTION FROM CSV/TSV REPOSITORIES
// Simulating production pipelines using transactional periodic commits
// ----------------------------------------------------------------------------

// Ingest Protein Nodes (OpenTargets canonical mappings)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/biographai/production-suite/main/data/proteins.csv' AS row
MERGE (p:Protein { id: row.ensemblId })
ON CREATE SET 
  p.symbol = row.symbol,
  p.name = row.proteinName,
  p.chromosome = row.chromosome,
  p.created_at = timestamp();

// Ingest Compound Nodes (ChEMBL canonical mappings)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/biographai/production-suite/main/data/compounds.csv' AS row
MERGE (c:Compound { id: row.chemblId })
ON CREATE SET 
  c.name = row.compoundName,
  c.inchi_key = row.inchiKey,
  c.phase = toInteger(row.maxPhase),
  c.is_approved = (row.maxPhase = "4");

// Ingest Disease Nodes (MONDO / EFO mappings)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/biographai/production-suite/main/data/diseases.csv' AS row
MERGE (d:Disease { id: row.diseaseId })
ON CREATE SET 
  d.name = row.diseaseName,
  d.category = row.therapeuticArea;

// ----------------------------------------------------------------------------
// 3. TARGET-AND-PATHWAY EDGE RELATIONSHIPS
// Generating therapeutic, genomic, physical, and chemical interactions
// ----------------------------------------------------------------------------

// Create Compound-Protein target bindings (ChEMBL target affinity trials)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/biographai/production-suite/main/data/bindings.csv' AS row
MATCH (c:Compound { id: row.chemblId })
MATCH (p:Protein { id: row.ensemblId })
MERGE (c)-[r:BINDS_TO]->(p)
ON CREATE SET 
  r.affinity_type = row.activityType, // e.g., IC50, Ki, Kd
  r.affinity_value = toFloat(row.activityValue), 
  r.unit = row.activityUnit,
  r.provenance = "ChEMBL v33";

// Create Protein-Protein interactions (STRING-DB high confidence maps)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/biographai/production-suite/main/data/ppi.csv' AS row
MATCH (p1:Protein { id: row.ensemblIdA })
MATCH (p2:Protein { id: row.ensemblIdB })
MERGE (p1)-[r:INTERACTS_WITH]->(p2)
ON CREATE SET 
  r.score = toFloat(row.combinedScore),
  r.coexpression = toFloat(row.coexpressionScore),
  r.provenance = "STRING-DB v12";

// Create Protein-Disease relationships (OpenTargets Genetic Association)
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/biographai/production-suite/main/data/associations.csv' AS row
MATCH (p:Protein { id: row.ensemblId })
MATCH (d:Disease { id: row.diseaseId })
MERGE (p)-[r:ASSOCIATED_WITH]->(d)
ON CREATE SET 
  r.score = toFloat(row.overallScore), // Multi-evidence genetic score
  r.literature_count = toInteger(row.literatureCount),
  r.provenance = "OpenTargets Platform v24";

// ----------------------------------------------------------------------------
// 4. BIOMEDICAL GRAPH ALGORITHMS (MAPPING MECHANISTIC CASCAFES)
// Identifying candidate disease-drug targets via pathway reasoning
// ----------------------------------------------------------------------------

// Query: Retrieve molecular pathways connecting an approved metabolic drug to oncology targets
// Example case: Metformin (CHEMBL560) transitioning to Prostate / Pancreatic cancer indications
MATCH path = (c:Compound { id: "CHEMBL560" })-[b:BINDS_TO]->(p1:Protein)-[i:INTERACTS_WITH*1..2]-(p2:Protein)-[a:ASSOCIATED_WITH]->(d:Disease)
WHERE toUpper(d.name) CONTAINS 'CANCER' OR toUpper(d.name) CONTAINS 'ACINAR'
RETURN 
  c.name AS Drug,
  p1.symbol AS DirectTarget,
  b.affinity_value AS DirectAffinity,
  [x IN nodes(path) | x.symbol] AS ProteinCascade,
  p2.symbol AS IndicationBridgeTarget,
  d.name AS RepurposedDisease,
  a.score AS TargetToDiseaseScore
ORDER BY a.score DESC, b.affinity_value ASC
LIMIT 10;

// Query: Jaccard Similarity of disease associations for drug repurposing target alignment
MATCH (p:Protein)-[a:ASSOCIATED_WITH]->(d:Disease)
WITH p, collect(id(d)) AS diseaseIds
MATCH (other:Protein)-[other_a:ASSOCIATED_WITH]->(d:Disease)
WHERE p <> other
WITH p, other, diseaseIds, collect(id(d)) AS otherDiseaseIds
WITH p, other,
     gds.similarity.jaccard(diseaseIds, otherDiseaseIds) AS JaccardSim
WHERE JaccardSim > 0.65
RETURN p.symbol AS ProteinA, other.symbol AS ProteinB, JaccardSim
ORDER BY JaccardSim DESC
LIMIT 15;
