import { useState } from 'react';
import { SidebarHeader } from './SidebarHeader.tsx';
import { ChatSidebarSearch } from './ChatSidebarSearch.tsx';
import { ChatList } from './ChatList.tsx';

export const LeftSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-full w-80 flex-col border-r border-slate-200 bg-white md:w-96">
      <SidebarHeader />

      <ChatSidebarSearch value={searchQuery} onChange={setSearchQuery} />
      <ChatList searchQuery={searchQuery} />
    </div>
  );
};
