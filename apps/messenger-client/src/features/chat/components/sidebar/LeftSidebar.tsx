import { useState } from 'react';
import { SidebarHeader } from './SidebarHeader.tsx';
import { ChatSidebarSearch } from './ChatSidebarSearch.tsx';
import { ChatList } from './ChatList.tsx';

export const LeftSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-80 md:w-96 flex flex-col border-r border-slate-200 bg-white h-full">
      <SidebarHeader />

      <ChatSidebarSearch value={searchQuery} onChange={setSearchQuery} />
      <ChatList searchQuery={searchQuery} />
    </div>
  );
};
