import React, { useState } from 'react';

const GitHubFooter = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  return (
    <footer className="w-full z-50 border border-white/30">
      <div
        className={`
          backdrop-blur-md border-t-2 transition-all duration-300
          ${isDarkTheme
            ? 'bg-black/80 text-white border-white/30'
            : 'bg-white/80 text-black border-black/30'
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          
         
         
          <a
            href="https://github.com/DIPANSHU66/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 min-w-0 flex-shrink"
          >
           
           
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.583 0-.288-.01-1.05-.015-2.06-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.24 1.84 1.24 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.234 1.91 1.234 3.22 0 4.61-2.805 5.624-5.475 5.922.43.37.815 1.103.815 2.222 0 1.606-.015 2.903-.015 3.293 0 .322.216.7.825.582C20.565 21.795 24 17.296 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="font-medium truncate">
              Scheduling Algorithm - Check on GitHub
            </span>
          </a>

        
        
          <div className="flex items-center gap-4 flex-shrink-0">
         

            <a
              href="https://github.com/DIPANSHU66/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 transition-colors ${
                isDarkTheme ? 'hover:text-yellow-300' : 'hover:text-yellow-500'
              }`}
            >
             
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.173L12 18.896l-7.336 3.87 1.402-8.173L.132 9.21l8.2-1.192z"/>
              </svg>
              <span className="text-sm">Star this repo</span>
            </a>

          
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDarkTheme
                  ? 'bg-gray-800/50 hover:bg-gray-700/70'
                  : 'bg-gray-200/50 hover:bg-gray-300/70'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? (
              

                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 13.292a5.646 5.646 0 110-11.292 5.646 5.646 0 010 11.292z"/>
                </svg>
              ) : (
                

                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M21.752 15.002a9.718 9.718 0 01-9.75 6.998 9.717 9.717 0 010-19.434 9.718 9.718 0 019.75 12.436z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GitHubFooter;
