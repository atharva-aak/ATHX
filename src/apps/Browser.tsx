import React, { useState, useEffect } from 'react';
import { SearchIcon, RefreshCwIcon, ArrowLeftIcon, ArrowRightIcon, HomeIcon, StarIcon, SettingsIcon } from 'lucide-react';

interface BrowserProps {
  initialUrl?: string;
}

const Browser: React.FC<BrowserProps> = ({ initialUrl = 'https://www.google.com/' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ url: string; title: string }[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };
  
  const formatUrl = (input: string) => {
    if (isValidUrl(input)) {
      return input;
    }
    
    if (input.includes('.') && !input.includes(' ')) {
      return `https://${input}`;
    }
    
    return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
  };
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedUrl = formatUrl(searchQuery || url);
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(formattedUrl);
      
      setUrl(formattedUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setIsLoading(false);
    }, 500);
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      setIsLoading(true);
      
      setTimeout(() => {
        setHistoryIndex(historyIndex - 1);
        setUrl(history[historyIndex - 1]);
        setIsLoading(false);
      }, 300);
    }
  };
  
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setIsLoading(true);
      
      setTimeout(() => {
        setHistoryIndex(historyIndex + 1);
        setUrl(history[historyIndex + 1]);
        setIsLoading(false);
      }, 300);
    }
  };
  
  const goHome = () => {
    const homeUrl = 'https://www.google.com/';
    setIsLoading(true);
    
    setTimeout(() => {
      if (url !== homeUrl) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(homeUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
      
      setUrl(homeUrl);
      setIsLoading(false);
    }, 300);
  };
  
  const reload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  const toggleBookmark = () => {
    const isBookmarked = bookmarks.some(b => b.url === url);
    
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(b => b.url !== url));
    } else {
      setBookmarks([...bookmarks, { url, title: getPageTitle(url) }]);
    }
  };
  
  const getPageTitle = (pageUrl: string) => {
    if (pageUrl.includes('google.com/search')) {
      const params = new URLSearchParams(pageUrl.split('?')[1]);
      return `Search: ${params.get('q')}`;
    }
    
    try {
      const domain = new URL(pageUrl).hostname;
      return domain.replace('www.', '');
    } catch {
      return pageUrl;
    }
  };
  
  const getPageContent = () => {
    if (url.includes('google.com')) {
      if (url.includes('/search')) {
        const params = new URLSearchParams(url.split('?')[1]);
        const query = params.get('q');
        
        return (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl mb-4">Search results for: {query}</h1>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="border-b pb-4 dark:border-gray-700">
                    <h2 className="text-blue-600 hover:underline cursor-pointer mb-1">
                      Example Search Result {i + 1}
                    </h2>
                    <p className="text-sm text-green-700 dark:text-green-400 mb-1">
                      https://example.com/result-{i + 1}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This is a simulated search result description that would appear in Google search results...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div className="h-full flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold mb-8">Google</h1>
          <div className="w-full max-w-2xl">
            <form onSubmit={handleUrlSubmit} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search Google or type a URL"
              />
            </form>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{getPageTitle(url)}</h1>
        <p className="mb-4">This is a simulated view of {url}</p>
        <p className="text-sm text-gray-500">Note: This browser cannot actually load external websites.</p>
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-2 border-b flex items-center space-x-2 dark:border-gray-700">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 dark:active:bg-gray-600"
          title="Back"
        >
          <ArrowLeftIcon size={16} className="dark:text-white" />
        </button>
        
        <button
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 dark:active:bg-gray-600"
          title="Forward"
        >
          <ArrowRightIcon size={16} className="dark:text-white" />
        </button>
        
        <button
          onClick={reload}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          title="Reload"
        >
          <RefreshCwIcon size={16} className={`${isLoading ? 'animate-spin' : ''} dark:text-white`} />
        </button>
        
        <button
          onClick={goHome}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          title="Home"
        >
          <HomeIcon size={16} className="dark:text-white" />
        </button>
        
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={14} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery || url}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search Google or type a URL"
            />
          </div>
        </form>
        
        <button
          onClick={toggleBookmark}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          title="Bookmark"
        >
          <StarIcon
            size={16}
            className={`${
              bookmarks.some(b => b.url === url)
                ? 'text-yellow-500 fill-current'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          />
        </button>
        
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          title="Settings"
        >
          <SettingsIcon size={16} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      {showBookmarks && (
        <div className="border-b dark:border-gray-700">
          <div className="p-2 flex items-center space-x-4 overflow-x-auto">
            {bookmarks.map((bookmark, index) => (
              <button
                key={index}
                onClick={() => {
                  setUrl(bookmark.url);
                  setSearchQuery('');
                  setShowBookmarks(false);
                }}
                className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <StarIcon size={12} className="text-yellow-500 fill-current" />
                <span className="truncate max-w-xs dark:text-white">{bookmark.title}</span>
              </button>
            ))}
            {bookmarks.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No bookmarks yet
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-full dark:text-white">
            {getPageContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browser;