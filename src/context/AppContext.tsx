import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Page, Workspace, Block, Template, RoadmapTask, CalendarEvent } from '../types';

interface AppContextType {
  workspace: Workspace;
  pages: Page[];
  blocks: Block[];
  templates: Template[];
  selectedPageId: string | null;
  selectedTemplateId: string | null;
  roadmapTasks: RoadmapTask[];
  calendarEvents: CalendarEvent[];
  isSidebarCollapsed: boolean;
  updateWorkspaceName: (name: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;
  updatePageIcon: (pageId: string, icon: string) => void; // Add this
  addPage: (parentId?: string) => void;
  deletePage: (pageId: string) => void;
  selectPage: (pageId: string) => void;
  selectTemplate: (templateId: string) => void;
  togglePageExpansion: (pageId: string) => void;
  toggleSidebar: () => void;
  getPageBlocks: (pageId: string) => Block[];
  getChildBlocks: (parentBlockId: string) => Block[];
  addBlock: (pageId: string, afterBlockId?: string, parentBlockId?: string) => Block;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  toggleBlockExpansion: (blockId: string) => void;
  // Roadmap methods
  addRoadmapTask: (task: Omit<RoadmapTask, 'id'>) => void;
  updateRoadmapTask: (taskId: string, updates: Partial<RoadmapTask>) => void;
  deleteRoadmapTask: (taskId: string) => void;
  // Calendar methods
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (eventId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy data
const initialWorkspace: Workspace = {
  id: 'workspace-1',
  name: 'Quantum'
};

const initialPages: Page[] = [
  {
    id: 'page-1',
    title: 'Welcome Page',
    parentId: null,
    createdAt: new Date('2025-01-01'),
    isExpanded: true,
    icon: '👋'
  },
  {
    id: 'page-2',
    title: 'Project A',
    parentId: null,
    createdAt: new Date('2025-01-02'),
    isExpanded: true,
    icon: '🚀'
  },
  {
    id: 'page-3',
    title: 'Task List',
    parentId: 'page-2',
    createdAt: new Date('2025-01-03'),
    isExpanded: false,
    icon: '✅'
  },
  {
    id: 'page-4',
    title: 'Meeting Notes',
    parentId: 'page-2',
    createdAt: new Date('2025-01-04'),
    isExpanded: false,
    icon: '📝'
  },
  {
    id: 'page-5',
    title: 'Resources',
    parentId: null,
    createdAt: new Date('2025-01-05'),
    isExpanded: false,
    icon: '📚'
  }
];

const initialTemplates: Template[] = [
  {
    id: 'template-roadmap',
    name: 'Roadmap',
    icon: '🗺️',
    description: 'Plan and track project milestones',
    type: 'roadmap'
  },
  {
    id: 'template-calendar',
    name: 'Calendar',
    icon: '📅',
    description: 'Organize events and deadlines',
    type: 'calendar'
  }
];

const initialRoadmapTasks: RoadmapTask[] = [
  {
    id: 'task-1',
    title: 'Project Planning & Research',
    description: 'Define project scope, research requirements, and plan initial architecture',
    category: 'Planning',
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    progress: 85,
    status: 'In Progress'
  },
  {
    id: 'task-2',
    title: 'UI/UX Design',
    description: 'Create wireframes, design system, and user interface mockups',
    category: 'Design',
    startDate: '2025-01-10',
    endDate: '2025-01-25',
    progress: 60,
    status: 'In Progress'
  },
  {
    id: 'task-3',
    title: 'Frontend Development',
    description: 'Implement React components and user interfaces',
    category: 'Development',
    startDate: '2025-01-20',
    endDate: '2025-02-10',
    progress: 0,
    status: 'Not Started'
  },
  {
    id: 'task-4',
    title: 'Backend Development',
    description: 'Build API endpoints and database structure',
    category: 'Development',
    startDate: '2025-01-25',
    endDate: '2025-02-15',
    progress: 0,
    status: 'Not Started'
  },
  {
    id: 'task-5',
    title: 'Testing & QA',
    description: 'Implement testing suite and quality assurance procedures',
    category: 'Development',
    startDate: '2025-02-10',
    endDate: '2025-02-25',
    progress: 0,
    status: 'Not Started'
  },
  {
    id: 'task-6',
    title: 'Deployment',
    description: 'Deploy application to production environment',
    category: 'Development',
    startDate: '2025-02-20',
    endDate: '2025-02-28',
    progress: 0,
    status: 'Not Started'
  }
];

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Project Kickoff Meeting',
    date: '2025-01-15',
    time: '10:00',
    tag: 'Meeting',
    color: 'bg-blue-500'
  },
  {
    id: 'event-2',
    title: 'Design Review',
    date: '2025-01-22',
    time: '14:00',
    tag: 'Review',
    color: 'bg-green-500'
  },
  {
    id: 'event-3',
    title: 'Sprint Planning',
    date: '2025-01-29',
    time: '09:00',
    tag: 'Planning',
    color: 'bg-purple-500'
  }
];

const initialBlocks: Block[] = [
  {
    id: 'block-1',
    type: 'heading',
    content: 'Welcome to your enhanced workspace!',
    pageId: 'page-1'
  },
  {
    id: 'block-2',
    type: 'text',
    content: 'This block editor now supports rich content types. Try typing "/" to see all available block types.',
    pageId: 'page-1'
  },
  {
    id: 'block-3',
    type: 'toggle',
    content: 'Click to expand this toggle block',
    isExpanded: false,
    children: ['block-4', 'block-5'],
    pageId: 'page-1'
  },
  {
    id: 'block-4',
    type: 'text',
    content: 'This is nested content inside the toggle block',
    pageId: 'page-1',
    parentBlockId: 'block-3'
  },
  {
    id: 'block-5',
    type: 'todo',
    content: 'Try this nested todo item',
    checked: false,
    pageId: 'page-1',
    parentBlockId: 'block-3'
  },
  {
    id: 'block-6',
    type: 'divider',
    content: '',
    pageId: 'page-1'
  },
  {
    id: 'block-7',
    type: 'code',
    content: 'console.log("Hello, World!");',
    language: 'javascript',
    pageId: 'page-1'
  },
  {
    id: 'block-8',
    type: 'heading',
    content: 'Project Overview',
    pageId: 'page-2'
  },
  {
    id: 'block-9',
    type: 'text',
    content: 'This project showcases a comprehensive block-based editor.',
    pageId: 'page-2'
  }
];

// Helper to generate a more unique ID
const generateUniqueId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [templates] = useState<Template[]>(initialTemplates);
  const [selectedPageId, setSelectedPageId] = useState<string | null>('page-1');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(initialRoadmapTasks);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const updateWorkspaceName = (name: string) => {
    setWorkspace(prev => ({ ...prev, name }));
  };

  const updatePageTitle = (pageId: string, title: string) => {
    setPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, title } : page
    ));
  };

  const updatePageIcon = (pageId: string, icon: string) => {
    setPages(prev => prev.map(page =>
      page.id === pageId ? { ...page, icon } : page
    ));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const addPage = (parentId?: string) => {
    const newPage: Page = {
      id: generateUniqueId('page'),
      title: 'Untitled',
      parentId: parentId || null,
      createdAt: new Date(),
      isExpanded: false,
      icon: '📄' // Default icon for new pages
    };

    setPages(prev => {
      let updatedPages = [...prev, newPage];
      if (parentId) {
        updatedPages = updatedPages.map(page =>
          page.id === parentId ? { ...page, isExpanded: true } : page
        );
      }
      return updatedPages;
    });
    
    setSelectedPageId(newPage.id);
    setSelectedTemplateId(null);

    // Add a default block for the new page
    const defaultBlock: Block = {
      id: generateUniqueId('block'),
      type: 'text',
      content: '',
      pageId: newPage.id
    };
    setBlocks(prev => [...prev, defaultBlock]);
  };

  const deletePage = (pageId: string) => {
    const descendantIds: string[] = [];
    const findDescendants = (parentId: string) => {
      const children = pages.filter(p => p.parentId === parentId);
      for (const child of children) {
        descendantIds.push(child.id);
        findDescendants(child.id);
      }
    };
    findDescendants(pageId);

    const idsToDelete = [pageId, ...descendantIds];
    const remainingPages = pages.filter(p => !idsToDelete.includes(p.id));

    setPages(remainingPages);
    setBlocks(prev => prev.filter(b => !idsToDelete.includes(b.pageId)));

    if (selectedPageId && idsToDelete.includes(selectedPageId)) {
      setSelectedPageId(remainingPages.length > 0 ? remainingPages[0].id : null);
    }
  };

  const selectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedTemplateId(null);
  };

  const selectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedPageId(null);
  };

  const togglePageExpansion = (pageId: string) => {
    setPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, isExpanded: !page.isExpanded } : page
    ));
  };

  const getPageBlocks = (pageId: string): Block[] => {
    return blocks.filter(block => block.pageId === pageId && !block.parentBlockId);
  };

  const getChildBlocks = (parentBlockId: string): Block[] => {
    return blocks.filter(block => block.parentBlockId === parentBlockId);
  };

  const addBlock = (pageId: string, afterBlockId?: string, parentBlockId?: string): Block => {
    const newBlock: Block = {
      id: generateUniqueId('block'),
      type: 'text',
      content: '',
      pageId,
      ...(parentBlockId && { parentBlockId })
    };

    setBlocks(prev => {
      let newBlocksArray = [...prev];

      if (afterBlockId) {
        const insertIndex = newBlocksArray.findIndex(block => block.id === afterBlockId) + 1;
        newBlocksArray.splice(insertIndex, 0, newBlock);
      } else {
        newBlocksArray.push(newBlock);
      }

      if (parentBlockId) {
        newBlocksArray = newBlocksArray.map(block =>
          block.id === parentBlockId
            ? { ...block, children: [...(block.children || []), newBlock.id] }
            : block
        );
      }
      
      return newBlocksArray;
    });

    return newBlock;
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    const blockToDelete = blocks.find(b => b.id === blockId);
    
    // If it's a toggle block, also delete its children
    if (blockToDelete?.type === 'toggle' && blockToDelete.children) {
      setBlocks(prev => prev.filter(block => 
        block.id !== blockId && !blockToDelete.children?.includes(block.id)
      ));
    } else {
      setBlocks(prev => prev.filter(block => block.id !== blockId));
    }

    // Remove from parent's children array if it has a parent
    if (blockToDelete?.parentBlockId) {
      setBlocks(prev => prev.map(block => 
        block.id === blockToDelete.parentBlockId 
          ? { ...block, children: block.children?.filter(childId => childId !== blockId) }
          : block
      ));
    }
  };

  const toggleBlockExpansion = (blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, isExpanded: !block.isExpanded } : block
    ));
  };

  // Roadmap methods
  const addRoadmapTask = (task: Omit<RoadmapTask, 'id'>) => {
    const newTask: RoadmapTask = {
      ...task,
      id: generateUniqueId('task')
    };
    setRoadmapTasks(prev => [...prev, newTask]);
  };

  const updateRoadmapTask = (taskId: string, updates: Partial<RoadmapTask>) => {
    setRoadmapTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteRoadmapTask = (taskId: string) => {
    setRoadmapTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Calendar methods
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateUniqueId('event')
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const updateCalendarEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const deleteCalendarEvent = (eventId: string) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <AppContext.Provider value={{
      workspace,
      pages,
      blocks,
      templates,
      selectedPageId,
      selectedTemplateId,
      roadmapTasks,
      calendarEvents,
      isSidebarCollapsed,
      updateWorkspaceName,
      updatePageTitle,
      updatePageIcon,
      addPage,
      deletePage,
      selectPage,
      selectTemplate,
      togglePageExpansion,
      toggleSidebar,
      getPageBlocks,
      getChildBlocks,
      addBlock,
      updateBlock,
      deleteBlock,
      toggleBlockExpansion,
      addRoadmapTask,
      updateRoadmapTask,
      deleteRoadmapTask,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
