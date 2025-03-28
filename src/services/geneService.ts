
// This is a mock service that would normally fetch data from a backend API
// In a real application, this would connect to genomic databases

export interface Gene {
  id: string;
  symbol: string;
  name: string;
  description: string;
  chromosome: string;
  start: number;
  end: number;
  diseases: Array<{ name: string; omimId: string }>;
  function: string;
  expression: Array<{ tissue: string; level: number }>;
  conservation: number;
  similarGenes: Array<{ symbol: string; score: number }>;
}

const mockGeneData: Record<string, Gene> = {
  'BRCA1': {
    id: 'ENSG00000012048',
    symbol: 'BRCA1',
    name: 'BRCA1 DNA repair associated',
    description: 'This gene encodes a tumor suppressor protein involved in DNA damage repair.',
    chromosome: '17',
    start: 43044295,
    end: 43125483,
    diseases: [
      { name: 'Breast-ovarian cancer, familial, susceptibility to, 1', omimId: '604370' },
      { name: 'Pancreatic cancer, susceptibility to, 4', omimId: '614320' }
    ],
    function: 'BRCA1 is a tumor suppressor gene that produces proteins to help repair damaged DNA. When BRCA1 is mutated or altered, DNA damage may not be repaired properly, and cells are more likely to develop genetic alterations that can lead to cancer. BRCA1 plays a critical role in maintaining genomic stability and acts as a hub for multiple cellular pathways including DNA damage repair, cell cycle regulation, and transcriptional regulation.',
    expression: [
      { tissue: 'Breast', level: 85 },
      { tissue: 'Ovary', level: 70 },
      { tissue: 'Pancreas', level: 40 },
      { tissue: 'Brain', level: 25 },
      { tissue: 'Muscle', level: 15 }
    ],
    conservation: 92,
    similarGenes: [
      { symbol: 'BRCA2', score: 76 },
      { symbol: 'TP53', score: 62 },
      { symbol: 'RAD51', score: 58 },
      { symbol: 'PALB2', score: 52 }
    ]
  },
  'TP53': {
    id: 'ENSG00000141510',
    symbol: 'TP53',
    name: 'Tumor protein p53',
    description: 'This gene encodes a tumor suppressor protein containing transcriptional activation, DNA binding, and oligomerization domains.',
    chromosome: '17',
    start: 7661779,
    end: 7687550,
    diseases: [
      { name: 'Li-Fraumeni syndrome', omimId: '151623' },
      { name: 'Adrenal cortical carcinoma', omimId: '202300' }
    ],
    function: 'TP53 encodes the p53 protein, known as the "guardian of the genome." It regulates cell division by keeping cells from growing and dividing too fast or in an uncontrolled way. It plays a crucial role in determining whether DNA will be repaired or whether the cell will undergo apoptosis (programmed cell death) if DNA damage is irreparable. Mutations in this gene are associated with a variety of human cancers.',
    expression: [
      { tissue: 'Lymph node', level: 90 },
      { tissue: 'Lung', level: 75 },
      { tissue: 'Colon', level: 65 },
      { tissue: 'Skin', level: 60 },
      { tissue: 'Liver', level: 50 }
    ],
    conservation: 95,
    similarGenes: [
      { symbol: 'MDM2', score: 82 },
      { symbol: 'CDKN1A', score: 75 },
      { symbol: 'BAX', score: 70 },
      { symbol: 'PTEN', score: 65 }
    ]
  },
  'EGFR': {
    id: 'ENSG00000146648',
    symbol: 'EGFR',
    name: 'Epidermal growth factor receptor',
    description: 'This gene encodes a transmembrane glycoprotein that is a member of the protein kinase superfamily.',
    chromosome: '7',
    start: 55086714,
    end: 55324313,
    diseases: [
      { name: 'Lung cancer, non-small cell', omimId: '211980' },
      { name: 'Glioblastoma', omimId: '137800' }
    ],
    function: 'EGFR is a cell surface receptor that binds to epidermal growth factor. Binding of the protein to a ligand induces receptor dimerization and tyrosine autophosphorylation, leading to cell proliferation. Mutations in this gene are associated with lung cancer, and overexpression or amplification of this gene is often observed in various epithelial tumors. It is a key target for cancer therapies.',
    expression: [
      { tissue: 'Skin', level: 95 },
      { tissue: 'Lung', level: 85 },
      { tissue: 'Colon', level: 70 },
      { tissue: 'Brain', level: 60 },
      { tissue: 'Kidney', level: 45 }
    ],
    conservation: 88,
    similarGenes: [
      { symbol: 'ERBB2', score: 80 },
      { symbol: 'KRAS', score: 72 },
      { symbol: 'MET', score: 68 },
      { symbol: 'PIK3CA', score: 65 }
    ]
  },
  'KRAS': {
    id: 'ENSG00000133703',
    symbol: 'KRAS',
    name: 'KRAS proto-oncogene, GTPase',
    description: 'This gene encodes a protein that is a member of the small GTPase superfamily.',
    chromosome: '12',
    start: 25358180,
    end: 25403854,
    diseases: [
      { name: 'Pancreatic cancer', omimId: '260350' },
      { name: 'Colorectal cancer', omimId: '114500' }
    ],
    function: 'KRAS is a member of the RAS family of GTPases, which function as binary molecular switches controlling cellular signaling networks. KRAS cycles between inactive GDP-bound and active GTP-bound states. In its active state, KRAS regulates various cellular processes including proliferation, differentiation, and survival. Mutations in KRAS lead to constitutive activation, which contributes to oncogenic transformation in various cancers.',
    expression: [
      { tissue: 'Pancreas', level: 90 },
      { tissue: 'Colon', level: 80 },
      { tissue: 'Lung', level: 75 },
      { tissue: 'Small intestine', level: 65 },
      { tissue: 'Stomach', level: 50 }
    ],
    conservation: 90,
    similarGenes: [
      { symbol: 'HRAS', score: 85 },
      { symbol: 'NRAS', score: 82 },
      { symbol: 'BRAF', score: 70 },
      { symbol: 'MAP2K1', score: 65 }
    ]
  },
  'PTEN': {
    id: 'ENSG00000171862',
    symbol: 'PTEN',
    name: 'Phosphatase and tensin homolog',
    description: 'This gene encodes a phosphatidylinositol-3,4,5-trisphosphate 3-phosphatase.',
    chromosome: '10',
    start: 87863113,
    end: 87971930,
    diseases: [
      { name: 'Cowden syndrome', omimId: '158350' },
      { name: 'Glioma susceptibility', omimId: '613028' }
    ],
    function: 'PTEN is a tumor suppressor gene that negatively regulates the AKT/PKB signaling pathway. It functions as a phosphatase to dephosphorylate phosphatidylinositol (3,4,5)-trisphosphate (PIP3), directly antagonizing the activity of phosphoinositide 3-kinase (PI3K). Loss of PTEN function leads to increased levels of PIP3, which in turn activates AKT signaling pathways, promoting cell survival and proliferation.',
    expression: [
      { tissue: 'Brain', level: 85 },
      { tissue: 'Breast', level: 75 },
      { tissue: 'Prostate', level: 70 },
      { tissue: 'Skin', level: 55 },
      { tissue: 'Thyroid', level: 50 }
    ],
    conservation: 94,
    similarGenes: [
      { symbol: 'PIK3CA', score: 78 },
      { symbol: 'AKT1', score: 75 },
      { symbol: 'MTOR', score: 68 },
      { symbol: 'TSC2', score: 62 }
    ]
  }
};

export const getGeneById = async (geneId: string): Promise<Gene | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Case-insensitive search
  const normalizedGeneId = geneId.toUpperCase();
  return mockGeneData[normalizedGeneId] || null;
};

export const searchGenes = async (query: string): Promise<Gene[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const normalizedQuery = query.toUpperCase();
  
  return Object.values(mockGeneData).filter(
    gene => 
      gene.symbol.toUpperCase().includes(normalizedQuery) || 
      gene.name.toUpperCase().includes(normalizedQuery)
  );
};
