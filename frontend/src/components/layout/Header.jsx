import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, Layers, Server, Sliders } from 'lucide-react';
import { getHealth } from '../../api/client';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Header = ({ onRefreshAll, isRefreshing, activeTab, setActiveTab }) => {
  const [backendOnline, setBackendOnline] = useState(null);

  const checkHealth = async () => {
    try {
      const res = await getHealth();
      setBackendOnline(res?.status === 'ok');
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: Layers },
    { id: 'assets', label: 'Asset Portfolio', icon: Server },
    { id: 'optimizer', label: 'Investment Optimizer', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-th-border bg-th-surface/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-2">

          {/* Logo & Product Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-th-brand flex items-center justify-center text-white shadow-soft">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-semibold text-th-text-primary font-serif tracking-tight">
                CyberRisk
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center space-x-1 border-b-2 border-transparent">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium transition-all relative rounded-full ${isActive
                    ? 'text-th-brand bg-th-brand-tint'
                    : 'text-th-text-secondary hover:text-th-text-primary hover:bg-th-surface-el'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-th-brand' : 'text-th-text-muted'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle & Action Button */}
          <div className="flex items-center space-x-3">

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Action Button */}
            <Button
              onClick={onRefreshAll}
              isLoading={isRefreshing}
              size="sm"
              title="Refresh Portfolio Risk Data"
            >
              {!isRefreshing && <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
              Refresh Report
            </Button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center space-x-1 py-2 overflow-x-auto border-t border-th-border">
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'bg-th-brand text-white'
                : 'text-th-text-secondary hover:text-th-text-primary bg-th-surface-el'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
