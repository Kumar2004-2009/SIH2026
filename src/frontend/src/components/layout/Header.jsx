import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, RefreshCw, Layers, Server, Sliders, Upload, BarChart3, Lock } from 'lucide-react';
import { getHealth } from '../../api/client';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDataset } from '../../context/DatasetContext';

export const Header = ({ onRefreshAll, isRefreshing, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasDataset, datasetMeta } = useDataset();
  const isInsightsPage = location.pathname === '/insights';

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

  const handleNavClick = (tabId) => {
    if (!hasDataset && !isInsightsPage) return;

    if (!isInsightsPage) {
      navigate('/insights');
    }
    if (setActiveTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-th-border bg-th-surface/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-2">

          {/* Logo & Product Brand */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-th-brand flex items-center justify-center text-white shadow-soft group-hover:bg-th-brand-hover transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-th-text-primary font-serif tracking-tight">
                CyberRisk
              </span>
              {hasDataset && isInsightsPage && (
                <Badge variant="brand" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 font-normal">
                  Active Run
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center space-x-1 border-b-2 border-transparent">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = isInsightsPage && activeTab === tab.id;
              const isDisabled = !hasDataset && !isInsightsPage;

              return (
                <button
                  key={tab.id}
                  disabled={isDisabled}
                  onClick={() => handleNavClick(tab.id)}
                  title={isDisabled ? 'Upload a dataset to unlock insights' : tab.label}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium transition-all relative rounded-full ${
                    isActive
                      ? 'text-th-brand bg-th-brand-tint'
                      : isDisabled
                      ? 'text-th-text-muted/60 opacity-60 cursor-not-allowed'
                      : 'text-th-text-secondary hover:text-th-text-primary hover:bg-th-surface-el cursor-pointer'
                  }`}
                >
                  {isDisabled ? (
                    <Lock className="w-3.5 h-3.5 text-th-text-muted/50" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-th-brand' : 'text-th-text-muted'}`} />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle & Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* If on Insights Page: Show "Change Dataset" & "Refresh" */}
            {isInsightsPage ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/')}
                  title="Upload another dataset"
                  className="hidden sm:inline-flex text-xs font-medium gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New</span>
                </Button>

                {onRefreshAll && (
                  <Button
                    onClick={onRefreshAll}
                    isLoading={isRefreshing}
                    size="sm"
                    title="Refresh Portfolio Risk Data"
                  >
                    {!isRefreshing && <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                    Refresh Report
                  </Button>
                )}
              </>
            ) : (
              /* If on Landing Page and dataset exists: Show "View Insights" button */
              hasDataset && (
                <Button
                  size="sm"
                  onClick={() => navigate('/insights')}
                  className="font-medium gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>View Insights</span>
                </Button>
              )
            )}
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        {isInsightsPage && (
          <div className="flex md:hidden items-center space-x-1 py-2 overflow-x-auto border-t border-th-border">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab && setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-th-brand text-white'
                    : 'text-th-text-secondary hover:text-th-text-primary bg-th-surface-el'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

      </div>
    </header>
  );
};
