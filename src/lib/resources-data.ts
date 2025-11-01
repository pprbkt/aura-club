
import type { Resource } from '@/hooks/use-auth';
import { Timestamp } from 'firebase/firestore';

export const preloadedResources: Resource[] = [
  // Fusion 360
  {
    id: 'fusion-airfoil-generator',
    title: 'Airfoil Generator',
    description: 'Generates NACA airfoil shapes directly into your sketches for wing/propeller design studies.',
    category: 'Plug-ins',
    link: 'https://apps.autodesk.com/FUSION/en/Detail/Index?id=1569210467479959341&appLang=en&os=Win64',
    image: 'https://picsum.photos/seed/propulsion/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Autodesk App Store)',
    tags: ['Fusion 360', 'Design Plugin', 'Aerodynamics']
  },
  {
    id: 'fusion-cadasio-addin',
    title: 'Cadasio Add-in',
    description: 'Creates interactive, step-by-step 3D assembly instructions and animations from your Fusion 360 design.',
    category: 'Plug-ins',
    link: 'https://apps.autodesk.com/FUSION/en/Detail/Index?id=737361129558618409&appLang=en&os=Win64',
    image: 'https://picsum.photos/seed/documentation/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Autodesk App Store)',
    tags: ['Fusion 360', 'Documentation', 'Animation']
  },
  {
    id: 'fusion-simlab-composer',
    title: 'SimLab Composer Integration',
    description: 'Transfers models for advanced rendering, VR visualization, and technical documentation.',
    category: 'Plug-ins',
    link: 'https://www.simlab-soft.com/3d-plugins/fusion-360-plugins.aspx',
    image: 'https://picsum.photos/seed/visualization/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Official Plugin Download)',
    tags: ['Fusion 360', 'Visualization', 'Rendering']
  },
  {
    id: 'fusion-static-stress',
    title: 'Built-in Static Stress',
    description: 'The core free solver for performing basic structural stress analysis on components.',
    category: 'Plug-ins',
    link: 'https://help.autodesk.com/view/fusion360/ENU/?guid=SIM-CONCEPT-STATIC-STRESS',
    image: 'https://picsum.photos/seed/fea-stress/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'FREE & Built-in (Simulation Workspace)',
    tags: ['Fusion 360', 'FEA', 'Built-in']
  },
  {
    id: 'fusion-mesh-workspace',
    title: 'Mesh Workspace',
    description: 'Tools for editing, repairing, and preparing complex meshes for 3D printing (replaces the older Meshmixer add-in).',
    category: 'Plug-ins',
    link: 'https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-B3456B5A-26A7-4632-A95B-653E55755536',
    image: 'https://picsum.photos/seed/mesh-edit/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'FREE & Built-in (Design Workspace)',
    tags: ['Fusion 360', 'Design', '3D Printing']
  },
  {
    id: 'fusion-simscale-addin',
    title: 'SimScale Add-in',
    description: 'Seamlessly sends complex models to the free SimScale web platform for full-featured CFD and advanced FEA analysis.',
    category: 'Plug-ins',
    link: 'https://www.simscale.com/integrations/fusion-360/',
    image: 'https://picsum.photos/seed/cloud-fea/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Autodesk App Store)',
    tags: ['Fusion 360', 'CFD', 'FEA']
  },
  // SOLIDWORKS
  {
    id: 'sw-driveworksxpress',
    title: 'DriveWorksXpress',
    description: 'Automates repetitive design tasks to quickly generate variations of parts, assemblies, and drawings.',
    category: 'Plug-ins',
    link: 'https://www.solidworks.com/partner-product/driveworksxpress',
    image: 'https://picsum.photos/seed/automation/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'FREE & Built-in (Tools > Xpress Products)',
    tags: ['SOLIDWORKS', 'Design Automation']
  },
  {
    id: 'sw-simulationxpress',
    title: 'SimulationXpress',
    description: 'Provides free, basic Finite Element Analysis (FEA) for stress testing individual parts.',
    category: 'Plug-ins',
    link: 'https://www.solidworks.com/product/solidworks-simulation',
    image: 'https://picsum.photos/seed/sw-fea/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'FREE & Built-in (Tools > Xpress Products)',
    tags: ['SOLIDWORKS', 'FEA', 'Built-in']
  },
  {
    id: 'sw-mysolidworks-tools',
    title: 'MySolidWorks Tools',
    description: 'Official hub to download free, verified models, toolboxes, and macro utilities.',
    category: 'Plug-ins',
    link: 'https://my.solidworks.com/toolbox',
    image: 'https://picsum.photos/seed/sw-resource/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Official Portal)',
    tags: ['SOLIDWORKS', 'Resource Access']
  },
  {
    id: 'sw-partner-directory',
    title: 'Certified Partner Directory',
    description: 'Directory to find partners who offer free "lite" or trial versions of advanced Simulation and CAM tools.',
    category: 'Plug-ins',
    link: 'https://www.solidworks.com/partner-product/',
    image: 'https://picsum.photos/seed/sw-partner/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Official SolidWorks Partner Directory)',
    tags: ['SOLIDWORKS', 'Functionality Access', 'Simulation']
  },
  {
    id: 'sw-simscale-platform',
    title: 'SimScale Platform',
    description: 'External web platform used for high-fidelity CFD and FEA by importing SolidWorks models (STEP/IGES).',
    category: 'Plug-ins',
    link: 'https://www.simscale.com/',
    image: 'https://picsum.photos/seed/sw-simscale/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'FREE for Public Projects (Web-based)',
    tags: ['SOLIDWORKS', 'CFD', 'FEA']
  },
  // NX
  {
    id: 'nx-student-addins',
    title: 'NX Student Edition Add-ins',
    description: 'Essential bundled features for professional workflows, including advanced import/export and documentation capabilities.',
    category: 'Plug-ins',
    link: 'https://www.siemens.com/us/en/products/software/nx/nx-for-students.html',
    image: 'https://picsum.photos/seed/nx-student/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'FREE & Bundled (With NX Student Edition)',
    tags: ['NX', 'Core Functionality']
  },
  {
    id: 'nx-addons-marketplace',
    title: 'NX Add-Ons Marketplace',
    description: 'The official marketplace for listing verified free and student-focused plugins (e.g., CAM, analysis, and file conversion).',
    category: 'Plug-ins',
    link: 'https://www.plm.automation.siemens.com/global/en/products/nx/nx-for-student/add-ons.html',
    image: 'https://picsum.photos/seed/nx-marketplace/400/225',
    status: 'approved',
    createdAt: Timestamp.fromDate(new Date()),
    authorName: 'AVAILABLE (Official Siemens Portal)',
    tags: ['NX', 'Resource Search', 'Analysis']
  }
];
