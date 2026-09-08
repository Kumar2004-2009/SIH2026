import React, { useEffect, useState } from 'react';
import {
  X,
  Server,
  TrendingUp,
  AlertTriangle,
  Database,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { getAssetDetail, formatCurrency } from '../../api/client';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AssetDetailPanel = ({ assetId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assetId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getAssetDetail(assetId)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.detail || err.message || 'Failed to fetch asset detail');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [assetId]);

  if (!assetId) return null;

  const exceedancePoints = (() => {
    if (!data) return [];
    if (data.loss_exceedance_curve && Array.isArray(data.loss_exceedance_curve)) {
      return data.loss_exceedance_curve;
    }
    const eal = data.EAL_usd || 0;
    const var95 = data.VaR95_usd || eal * 2.5;
    const var99 = data.VaR99_usd || var95 * 1.5;

    return [
      { probability: '50%', loss: Math.round(eal * 0.7), probNum: 50 },
      { probability: '20%', loss: Math.round(eal * 1.2), probNum: 20 },
      { probability: '10%', loss: Math.round(eal * 1.8), probNum: 10 },
      { probability: '5% (VaR 95)', loss: Math.round(var95), probNum: 5 },
      { probability: '1% (VaR 99)', loss: Math.round(var99), probNum: 1 },
      { probability: '0.1%', loss: Math.round(var99 * 1.4), probNum: 0.1 },
    ];
  })();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-th-surface border-l border-th-border shadow-2xl h-full flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-th-border bg-th-surface-el flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-th-brand-tint text-th-brand shadow-soft">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-th-text-primary font-mono">
                  {assetId}
                </h2>
                <Badge variant="brand">
                  {data?.business_unit || 'Asset'}
                </Badge>
              </div>
              <p className="text-xs text-th-text-muted mt-0.5">Open FAIR™ Risk Quantification Breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-th-text-muted hover:text-th-text-primary hover:bg-th-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <Card className="h-20 p-4 border-none bg-th-bg"></Card>
              <div className="grid grid-cols-2 gap-3">
                <Card className="h-24 p-4 border-none bg-th-bg"></Card>
                <Card className="h-24 p-4 border-none bg-th-bg"></Card>
              </div>
              <Card className="h-56 p-4 border-none bg-th-bg"></Card>
            </div>
          ) : error ? (
            <div className="p-5 rounded-xl bg-th-danger-tint border border-th-danger/30 text-center shadow-soft">
              <AlertTriangle className="w-6 h-6 text-th-danger mx-auto mb-2" />
              <p className="text-sm font-semibold text-th-danger font-serif">Error Loading Asset Data</p>
              <p className="text-xs text-th-danger/90 mt-1">{error}</p>
            </div>
          ) : data ? (
            <>
              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Card className="p-4 shadow-soft">
                  <span className="text-xs text-th-text-secondary font-medium">Expected Loss (EAL)</span>
                  <div className="text-xl font-bold font-serif text-th-text-primary mt-1 tabular-nums">
                    {formatCurrency(data.EAL_usd)}
                  </div>
                  <span className="text-[11px] text-th-brand mt-1 block font-medium">Annualized Mean</span>
                </Card>

                <Card className="p-4 shadow-soft">
                  <span className="text-xs text-th-text-secondary font-medium">Value at Risk 95%</span>
                  <div className="text-xl font-bold font-serif text-th-warning mt-1 tabular-nums">
                    {formatCurrency(data.VaR95_usd)}
                  </div>
                  <span className="text-[11px] text-th-warning mt-1 block font-medium">1-in-20 Year Tail</span>
                </Card>

                <Card className="p-4 shadow-soft col-span-2 sm:col-span-1">
                  <span className="text-xs text-th-text-secondary font-medium">Value at Risk 99%</span>
                  <div className="text-xl font-bold font-serif text-th-danger mt-1 tabular-nums">
                    {formatCurrency(data.VaR99_usd)}
                  </div>
                  <span className="text-[11px] text-th-danger mt-1 block font-medium">1-in-100 Year Cat</span>
                </Card>
              </div>

              {/* Asset Attribute Details */}
              <Card className="p-5 bg-th-surface-el shadow-soft">
                <h4 className="text-sm font-semibold text-th-text-primary font-serif flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-th-brand" />
                  Asset Metadata & Risk Parameters
                </h4>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div className="text-th-text-muted">Business Unit:</div>
                  <div className="text-th-text-primary font-medium">{data.business_unit || 'N/A'}</div>

                  <div className="text-th-text-muted">Criticality Rating:</div>
                  <div className="text-th-text-primary font-medium">{data.criticality || 'N/A'}</div>

                  <div className="text-th-text-muted">Risk Priority Score:</div>
                  <div className="text-th-brand font-mono font-bold">
                    {data.priority_score !== undefined ? Number(data.priority_score).toFixed(1) : 'N/A'}
                  </div>

                  {data.asset_type && (
                    <>
                      <div className="text-th-text-muted">Asset Type:</div>
                      <div className="text-th-text-primary">{data.asset_type}</div>
                    </>
                  )}
                </div>
              </Card>

              {/* Loss Exceedance Curve (LEC) Chart */}
              <Card className="p-5 shadow-card space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-th-text-primary font-serif flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-th-brand" />
                    Loss Exceedance Curve (LEC)
                  </h4>
                  <p className="text-xs text-th-text-secondary mt-1">
                    Probability that annual loss exceeds threshold value
                  </p>
                </div>

                <div className="h-56 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={exceedancePoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLossEmerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-area-fill-start)" />
                          <stop offset="95%" stopColor="var(--chart-area-fill-end)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="probability" stroke="var(--chart-axis)" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="var(--chart-axis)"
                        fontSize={11}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(val) => [formatCurrency(val), 'Loss Threshold']}
                        contentStyle={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          boxShadow: 'var(--shadow-elevated)',
                        }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="loss"
                        stroke="var(--chart-area-stroke)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorLossEmerald)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-th-border bg-th-surface-el flex justify-end">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Close Panel
          </Button>
        </div>

      </div>
    </div>
  );
};
