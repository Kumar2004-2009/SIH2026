import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { ExecutiveSummary } from '../components/dashboard/ExecutiveSummary';
import { BusinessUnitChart } from '../components/dashboard/BusinessUnitChart';
import { AssetRiskTable } from '../components/dashboard/AssetRiskTable';
import { AssetDetailPanel } from '../components/dashboard/AssetDetailPanel';
import { ControlsROIChart } from '../components/dashboard/ControlsROIChart';
import { WhatIfOptimizer } from '../components/dashboard/WhatIfOptimizer';
import { ChatWidget } from '../components/chatbot/ChatWidget';
import { useApi } from '../hooks/useApi';
import { getOrgRisk, getBusinessUnits, getAssets, getControlsRoi } from '../api/client';
import {
  Server,
  Zap,
  Award,
  Shield,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API hooks
  const orgRisk = useApi(getOrgRisk);
  const businessUnits = useApi(getBusinessUnits);
  const assets = useApi(getAssets);
  const controlsRoi = useApi(getControlsRoi);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        orgRisk.refetch(),
        businessUnits.refetch(),
        assets.refetch(),
        controlsRoi.refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const orgEal = orgRisk.data?.eal_usd ?? orgRisk.data?.EAL_usd ?? 0;

  return (
    <div className="min-h-screen flex flex-col font-sans theme-transition bg-th-bg">
      {/* Top Navigation */}
      <Header
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-fluid-lg space-y-fluid-md">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-fluid-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Stat Tiles & Hero */}
            <ExecutiveSummary
              data={orgRisk.data}
              loading={orgRisk.loading}
              error={orgRisk.error}
              statusCode={orgRisk.statusCode}
              onRetry={orgRisk.refetch}
            />

            {/* Middle Section: Business Units & Controls ROI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-fluid-md">
              <div className="lg:col-span-6">
                <BusinessUnitChart
                  data={businessUnits.data}
                  loading={businessUnits.loading}
                  error={businessUnits.error}
                  onRetry={businessUnits.refetch}
                />
              </div>

              <div className="lg:col-span-6">
                <ControlsROIChart
                  data={controlsRoi.data}
                  loading={controlsRoi.loading}
                  error={controlsRoi.error}
                  onRetry={controlsRoi.refetch}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSET PORTFOLIO */}
        {activeTab === 'assets' && (
          <div className="space-y-fluid-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-th-border pb-4">
              <div>
                <h2 className="text-xl font-semibold text-th-text-primary font-serif flex items-center gap-2">
                  <Server className="w-5 h-5 text-th-brand" />
                  <span>Asset Cyber Risk Portfolio &amp; Threat Analysis</span>
                </h2>
                <p className="text-xs text-th-text-secondary mt-0.5">
                  Comprehensive Open FAIR™ quantitative financial loss modeling across operational assets.
                </p>
              </div>
            </div>

            <AssetRiskTable
              assets={assets.data}
              loading={assets.loading}
              error={assets.error}
              onSelectAsset={(id) => setSelectedAssetId(id)}
              selectedAssetId={selectedAssetId}
            />
          </div>
        )}

        {/* TAB 3: CONTROLS & ROI */}
        {activeTab === 'controls' && (
          <div className="space-y-fluid-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-th-border pb-4">
              <div>
                <h2 className="text-xl font-semibold text-th-text-primary font-serif flex items-center gap-2">
                  <Award className="w-5 h-5 text-th-brand" />
                  <span>Security Controls &amp; Investment Return (ROSI)</span>
                </h2>
                <p className="text-xs text-th-text-secondary mt-0.5">
                  Benchmarked risk reduction efficiency for defense-in-depth security engineering.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-fluid-md">
              <div className="lg:col-span-7">
                <ControlsROIChart
                  data={controlsRoi.data}
                  loading={controlsRoi.loading}
                  error={controlsRoi.error}
                  onRetry={controlsRoi.refetch}
                />
              </div>

              <div className="lg:col-span-5 h-full">
                <Card className="h-full flex flex-col justify-between">
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-th-brand">
                      <Zap className="w-5 h-5" />
                      <h3 className="text-sm font-semibold text-th-text-primary font-serif">ROSI Formula &amp; Actuarial Methodology</h3>
                    </div>
                    <div className="p-4 rounded-lg bg-th-surface-el border border-th-border text-sm font-mono text-th-text-primary flex items-center justify-center">
                      ROSI = (Risk Reduction) / (Cost)
                    </div>
                    <p className="text-sm text-th-text-secondary leading-relaxed">
                      Controls are ranked by their ability to reduce annualized loss per dollar spent. A ROSI of <strong className="text-th-text-primary font-semibold">3.5x</strong> indicates each $1 invested in security engineering mitigates $3.50 in Expected Annual Loss.
                    </p>
                  </CardContent>

                  <div className="m-6 mt-0 p-4 rounded-lg bg-th-brand text-white text-sm">
                    <span className="font-semibold block mb-1 font-serif text-white">Next Step: </span>
                    <span className="text-white/90">Switch to the <strong>Investment Optimizer</strong> tab to allocate a constrained security budget automatically using the exact Knapsack ILP algorithm.</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WHAT-IF OPTIMIZER */}
        {activeTab === 'optimizer' && (
          <div className="space-y-fluid-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WhatIfOptimizer orgEal={orgEal} />
          </div>
        )}
      </main>

      {/* Asset Drilldown Side Panel */}
      {selectedAssetId && (
        <AssetDetailPanel
          assetId={selectedAssetId}
          onClose={() => setSelectedAssetId(null)}
        />
      )}

      {/* Floating AI Chatbot Widget */}
      <ChatWidget />

      {/* Modern Editorial Footer */}
      <footer className="border-t border-th-border bg-th-surface py-12 text-sm text-th-text-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
            {/* Brand & Copyright */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded bg-th-brand flex items-center justify-center text-white">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-th-text-primary font-serif">CyberRisk Platform</span>
              </div>
              <p className="text-th-text-muted text-xs">
                &copy; {new Date().getFullYear()} CyberRisk Inc. All rights reserved.
              </p>
            </div>

            {/* Resources Links */}
            <div className="flex flex-col space-y-2 md:items-center">
              <h4 className="text-th-text-primary font-semibold mb-1">Resources</h4>
              <a href="#" className="hover:text-th-brand transition-colors text-xs">Documentation</a>
              <a href="#" className="hover:text-th-brand transition-colors text-xs">Methodology</a>
              <a href="#" className="hover:text-th-brand transition-colors text-xs">API Reference</a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col space-y-2 md:items-end">
              <h4 className="text-th-text-primary font-semibold mb-1">Legal</h4>
              <a href="#" className="hover:text-th-brand transition-colors text-xs">Privacy Policy</a>
              <a href="#" className="hover:text-th-brand transition-colors text-xs">Terms of Service</a>
              <a href="#" className="hover:text-th-brand transition-colors text-xs">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardPage;
