import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, FileText, Folder, Menu, X, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';

const Sidebar: React.FC = () => {
  const { 
    workspace, 
    pages, 
    templates, 
    selectedPageId, 
    selectedTemplateId,
    isSidebarCollapsed,
    updatePageTitle,
    addPage,
    deletePage,
    selectPage, 
    selectTemplate,
    togglePageExpansion,
    toggleSidebar
  } = useApp();
  
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageTitle, setEditingPageTitle] = useState('');

  const handlePageTitleEdit = (page: Page) => {
    if (!isSidebarCollapsed) {
      setEditingPageId(page.id);
      setEditingPageTitle(page.title);
    }
  };

  const handlePageTitleSubmit = () => {
    if (editingPageId && editingPageTitle.trim()) {
      updatePageTitle(editingPageId, editingPageTitle.trim());
    }
    setEditingPageId(null);
    setEditingPageTitle('');
  };

  const handlePageTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditingPageId(null);
      setEditingPageTitle('');
    }
  };

  const handleDeletePage = (page: Page) => {
    if (window.confirm(`Are you sure you want to delete "${page.title}" and all its sub-pages?`)) {
      deletePage(page.id);
    }
  };

  const getChildPages = (parentId: string | null): Page[] => {
    return pages.filter(page => page.parentId === parentId);
  };

  const hasChildren = (pageId: string): boolean => {
    return pages.some(page => page.parentId === pageId);
  };

  const renderPage = (page: Page, level: number = 0) => {
    const children = getChildPages(page.id);
    const hasChildPages = hasChildren(page.id);
    const isSelected = selectedPageId === page.id;
    const isExpanded = page.isExpanded;
    const isEditing = editingPageId === page.id;

    if (isSidebarCollapsed && level > 0) {
      return null; // Don't render child pages when collapsed
    }

    return (
      <div key={page.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 rounded-md cursor-pointer group transition-colors ${
            isSelected
              ? 'bg-slate-700 text-white'
              : 'text-gray-300 hover:bg-slate-800 hover:text-white'
          }`}
          style={{ paddingLeft: isSidebarCollapsed ? '8px' : `${level * 16 + 8}px` }}
          onClick={() => !isEditing && selectPage(page.id)}
          title={isSidebarCollapsed ? page.title : undefined}
        >
          <div className="flex items-center flex-1 min-w-0">
            {!isSidebarCollapsed && hasChildPages ? (
              <button
                className="p-0.5 rounded hover:bg-slate-700 mr-1 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePageExpansion(page.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            ) : (
              <div className={`${isSidebarCollapsed ? 'w-0' : 'w-5'} flex-shrink-0`} />
            )}
            
            {page.icon ? (
              <span className="mr-2 text-sm flex-shrink-0">{page.icon}</span>
            ) : (
              <FileText size={14} className="mr-2 flex-shrink-0 text-gray-400" />
            )}
            {!isSidebarCollapsed && (
              <>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingPageTitle}
                    onChange={(e) => setEditingPageTitle(e.target.value)}
                    onBlur={handlePageTitleSubmit}
                    onKeyDown={handlePageTitleKeyPress}
                    className="flex-1 px-1 py-0.5 text-sm bg-slate-900 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    className="truncate text-sm hover:bg-slate-800 px-1 py-0.5 rounded flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageTitleEdit(page);
                    }}
                  >
                    {page.title}
                  </span>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center ml-auto pl-1">
            {!isSidebarCollapsed && !isEditing && (
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); addPage(page.id); }}
                  title="Add sub-page"
                  className="p-1 rounded hover:bg-slate-700"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeletePage(page); }}
                  title="Delete page"
                  className="p-1 rounded hover:bg-slate-700 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {!isSidebarCollapsed && hasChildPages && isExpanded && (
          <div>
            {children.map(child => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootPages = getChildPages(null);

  return (
    <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-slate-900 border-r border-slate-700 h-screen flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Workspace Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
            Q
          </div>
          {!isSidebarCollapsed && (
            <h1 className="text-lg font-bold text-gray-100">
              {workspace.name}
            </h1>
          )}
        </div>
        
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors text-gray-400"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Templates Section */}
        <div className="mb-4">
          <div
            className="flex items-center py-1 px-2 rounded-md cursor-pointer text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
            onClick={() => !isSidebarCollapsed && setIsTemplatesExpanded(!isTemplatesExpanded)}
            title={isSidebarCollapsed ? 'Templates' : undefined}
          >
            {!isSidebarCollapsed && (
              <button className="p-0.5 rounded hover:bg-slate-700 mr-1 flex-shrink-0">
                {isTemplatesExpanded ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            )}
            <Folder size={14} className="mr-2 flex-shrink-0 text-gray-400" />
            {!isSidebarCollapsed && (
              <span className="text-sm font-medium">Templates</span>
            )}
          </div>
          
          {!isSidebarCollapsed && isTemplatesExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`flex items-center py-1 px-2 rounded-md cursor-pointer group transition-colors ${
                    selectedTemplateId === template.id
                      ? 'bg-slate-700 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => selectTemplate(template.id)}
                >
                  <span className="mr-2 text-sm">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="truncate text-sm">{template.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Collapsed Templates - Show as icons */}
          {isSidebarCollapsed && (
            <div className="mt-2 space-y-1">
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`flex items-center justify-center py-2 px-2 rounded-md cursor-pointer transition-colors ${
                    selectedTemplateId === template.id
                      ? 'bg-slate-700 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => selectTemplate(template.id)}
                  title={template.name}
                >
                  <span className="text-sm">{template.icon}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pages Section */}
        <div>
          {!isSidebarCollapsed && (
            <div className="flex items-center py-1 px-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pages</span>
            </div>
          )}
          <div className="space-y-1">
            {rootPages.map(page => renderPage(page))}
          </div>
        </div>
      </div>

      {/* Add Page Button */}
      <div className="p-2 border-t border-slate-700">
        <button
          onClick={() => addPage()}
          className={`w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
          title={isSidebarCollapsed ? 'Add Page' : undefined}
        >
          <Plus size={16} className={isSidebarCollapsed ? '' : 'mr-2'} />
          {!isSidebarCollapsed && 'Add Page'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
