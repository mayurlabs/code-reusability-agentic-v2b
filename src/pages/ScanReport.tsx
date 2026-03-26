import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { scanReports, clusters, scoreHistory } from '../data/mockData';
import type { Cluster } from '../data/mockData';

interface ScanReportProps {
  reportId: string;
  onBack: () => void;
}

const FRIENDLY_NAMES: Record<string, string> = {
  'Pricing Rules Calculator Variants': 'Pricing and Discount Logic',
  'Address Validation Service Family': 'Address Validation',
  'Legacy Lead Scoring Utilities': 'Lead Scoring',
  'Quote Sync REST Wrapper Patterns': 'Quote Sync Wrappers',
  'Renewal Date Normalization Helpers': 'Renewal Date Helpers',
  'Opportunity Territory Assignment Logic': 'Territory Assignment',
  'Invoice Tax Computation Methods': 'Invoice Tax Calculation',
  'Case Escalation Trigger Branches': 'Case Escalation Logic',
  'Sales Forecast Rollup Utilities': 'Sales Forecast Rollups',
  'Discount Approval Threshold Evaluators': 'Discount Approval Logic',
};

const FRIENDLY_RECOMMENDATIONS: Record<string, string> = {
  Standardize: 'Pick the best version to keep',
  Review: 'Review and decide',
  Consolidate: 'Merge into one',
  'Retire Variant': 'Remove older versions',
  Monitor: 'Monitor for now',
};

const PRIORITY_COLORS: Record<string, string> = {
  High: '#c23934',
  Medium: '#fe9339',
  Low: '#2e844a',
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function extractLinesNumber(reduction: string): string {
  const match = reduction.match(/~?(\d[\d,]*)\s*lines/);
  return match ? match[1] : reduction;
}

function formatInvocations(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function SkeletonBlock({ height, width }: { height: number; width?: string }) {
  return (
    <div
      style={{
        height,
        width: width || '100%',
        borderRadius: 6,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--sf-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  marginBottom: 4,
};

const metaValueStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--sf-text)',
};

export default function ScanReport({ reportId, onBack }: ScanReportProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const report = scanReports.find((r) => r.id === reportId) || scanReports[0];
  const detailedCluster = clusters.find((c) => c.id === 'cl-001')!;

  if (!loaded) {
    return (
      <div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div style={{ marginBottom: 16 }}>
          <SkeletonBlock height={16} width="260px" />
        </div>
        <div className="sf-card" style={{ marginBottom: 20 }}>
          <SkeletonBlock height={24} width="400px" />
          <div style={{ marginTop: 16 }}>
            <SkeletonBlock height={60} />
          </div>
        </div>
        <div className="sf-card" style={{ marginBottom: 20 }}>
          <SkeletonBlock height={16} width="200px" />
          <div style={{ marginTop: 12 }}>
            <SkeletonBlock height={60} />
          </div>
        </div>
        <div className="sf-card" style={{ marginBottom: 20 }}>
          <SkeletonBlock height={16} width="160px" />
          <div style={{ marginTop: 12 }}>
            <SkeletonBlock height={100} />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="sf-card" style={{ marginBottom: 16 }}>
            <SkeletonBlock height={40} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Back navigation */}
      <div className="sf-breadcrumb" style={{ marginBottom: 8 }}>
        <a href="#" onClick={(e) => e.preventDefault()}>SETUP</a>
        <span className="sep">›</span>
        <a href="#" onClick={(e) => e.preventDefault()}>CODE INTELLIGENCE</a>
        <span className="sep">›</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          CODE REUSABILITY
        </a>
        <span className="sep">›</span>
        <span>Report</span>
      </div>

      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--sf-blue)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 20,
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Back to Code Reusability
      </button>

      {/* ─── Report Header ─── */}
      <div className="sf-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{report.name}</h1>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                fontSize: 13,
                color: 'var(--sf-text-secondary)',
              }}
            >
              <div>
                <div style={labelStyle}>Requested By</div>
                <div style={metaValueStyle}>{report.requestedBy}</div>
              </div>
              <div>
                <div style={labelStyle}>Generated On</div>
                <div style={metaValueStyle}>{formatDate(report.requestedDate)}</div>
              </div>
              <div>
                <div style={labelStyle}>Environment</div>
                <div style={metaValueStyle}>{report.environment}</div>
              </div>
              <div>
                <div style={labelStyle}>Scope</div>
                <div style={metaValueStyle}>{report.scope.join(', ')}</div>
              </div>
              <div>
                <div style={labelStyle}>Runtime Enrichment</div>
                <div style={metaValueStyle}>{report.runtimeEnrichment ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: 'var(--sf-text)', lineHeight: 1 }}>
              {report.score}
            </div>
            {report.scoreDelta !== null && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 8,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: '#e6f9ed',
                  color: 'var(--sf-success)',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                +{report.scoreDelta} vs previous
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Executive Summary ─── */}
      <div className="sf-card" style={{ marginBottom: 20 }}>
        <h2 className="sf-section-title">Executive Summary</h2>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--sf-text)' }}>
          This report analyzed 1,842 code assets across Apex, Triggers, LWC JS, and SOQL patterns
          in the Northstar Retail Group production org. The scan identified 12 groups of similar
          code that represent opportunities to simplify and standardize. Your Code Reuse Score
          improved by 9 points since the last scan, reflecting successful cleanup of pricing rule
          variants and address validation logic.
        </p>
      </div>

      {/* ─── Score Explanation ─── */}
      <div className="sf-card" style={{ marginBottom: 20 }}>
        <h2 className="sf-section-title">What Changed</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--sf-success)',
                marginBottom: 12,
              }}
            >
              <CheckCircle2 size={16} />
              Improved
            </div>
            {[
              '3 pricing variants consolidated into a shared engine',
              'Address validation standardized across checkout and account creation',
              '4 trigger helpers cleaned up and merged',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--sf-text)',
                }}
              >
                <span style={{ color: 'var(--sf-success)', fontWeight: 700, flexShrink: 0 }}>+</span>
                {item}
              </div>
            ))}
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--sf-warning)',
                marginBottom: 12,
              }}
            >
              <AlertTriangle size={16} />
              Needs Attention
            </div>
            {[
              'Quote sync wrappers still repeated across 5 integration points',
              'Renewal helpers still duplicated with fiscal year drift',
              'New discount approval group detected in recent sprint',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--sf-text)',
                }}
              >
                <span style={{ color: 'var(--sf-warning)', fontWeight: 700, flexShrink: 0 }}>!</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Findings Overview ─── */}
      <h2 className="sf-section-title" style={{ marginBottom: 16, marginTop: 8 }}>
        Findings Overview
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {clusters.map((cluster) => (
          <FindingCard key={cluster.id} cluster={cluster} />
        ))}
      </div>

      {/* ─── Detailed Analysis (cl-001) ─── */}
      <div className="sf-card" style={{ marginBottom: 20 }}>
        <h2 className="sf-section-title" style={{ marginBottom: 16 }}>
          Detailed Analysis: {FRIENDLY_NAMES[detailedCluster.name] || detailedCluster.name}
        </h2>

        {/* Preferred candidate */}
        <div
          style={{
            background: '#f9fbfd',
            border: '1px solid #e0e6ed',
            borderRadius: 6,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ ...labelStyle, marginBottom: 8 }}>Best version to keep</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            {detailedCluster.preferredCandidate}
          </div>
          <div style={{ fontSize: 12, color: 'var(--sf-text-secondary)' }}>
            Owner: {detailedCluster.members[0]?.owner} ·{' '}
            {formatInvocations(detailedCluster.members[0]?.invocations30d || 0)}/30d ·{' '}
            {formatInvocations(detailedCluster.members[0]?.invocations90d || 0)}/90d
          </div>
        </div>

        {/* All implementations mini-table */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>All implementations</div>
          <table className="sf-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Usage (30d)</th>
                <th>Similarity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {detailedCluster.members.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td style={{ color: 'var(--sf-text-secondary)' }}>{m.owner}</td>
                  <td>{formatInvocations(m.invocations30d)}</td>
                  <td>{m.similarity}%</td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background:
                          m.badge === 'Preferred'
                            ? '#e6f9ed'
                            : m.badge === 'Legacy'
                              ? '#fde8e8'
                              : '#f0f0f0',
                        color:
                          m.badge === 'Preferred'
                            ? 'var(--sf-success)'
                            : m.badge === 'Legacy'
                              ? 'var(--sf-error)'
                              : 'var(--sf-text-secondary)',
                      }}
                    >
                      {m.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* What's the same */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>What's the same</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {detailedCluster.commonBlocks.map((block, i) => (
              <li
                key={i}
                style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--sf-text)' }}
              >
                {block}
              </li>
            ))}
          </ul>
        </div>

        {/* What's different */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>What's different</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {detailedCluster.differences.map((diff, i) => (
              <li
                key={i}
                style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--sf-text)' }}
              >
                {diff}
              </li>
            ))}
          </ul>
        </div>

        {/* Dependencies */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Dependencies</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {detailedCluster.members
              .filter((m) => m.dependencies)
              .map((m) => (
                <div
                  key={m.id}
                  style={{
                    border: '1px solid var(--sf-border)',
                    borderRadius: 6,
                    padding: 12,
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{m.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, color: 'var(--sf-text-secondary)' }}>
                    <span>Inbound: {m.dependencies.inboundCount}</span>
                    <span>Outbound: {m.dependencies.outboundCount}</span>
                    <span>
                      Risk:{' '}
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            m.dependencies.riskLevel === 'High'
                              ? 'var(--sf-error)'
                              : m.dependencies.riskLevel === 'Moderate'
                                ? 'var(--sf-warning)'
                                : 'var(--sf-success)',
                        }}
                      >
                        {m.dependencies.riskLevel}
                      </span>
                    </span>
                    <span>
                      Migration Ready:{' '}
                      <span
                        style={{
                          fontWeight: 600,
                          color: m.dependencies.migrationReady
                            ? 'var(--sf-success)'
                            : 'var(--sf-error)',
                        }}
                      >
                        {m.dependencies.migrationReady ? 'Yes' : 'No'}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recommended Steps */}
        <div>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Recommended Steps</div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {detailedCluster.nextSteps.map((step, i) => (
              <li
                key={i}
                style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--sf-text)', marginBottom: 4 }}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ─── Score Trend ─── */}
      <div className="sf-card" style={{ marginBottom: 20 }}>
        <h2 className="sf-section-title">Score History</h2>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#706e6b' }}
                axisLine={{ stroke: '#e5e5e5' }}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fontSize: 12, fill: '#706e6b' }}
                axisLine={{ stroke: '#e5e5e5' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0176d3"
                strokeWidth={2}
                dot={{ fill: '#0176d3', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Audit Metadata ─── */}
      <div className="sf-card" style={{ marginBottom: 40 }}>
        <h2 className="sf-section-title">Scan Details</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {[
            { label: 'Report Name', value: report.name },
            { label: 'Requested By', value: report.requestedBy },
            { label: 'Date', value: formatDate(report.requestedDate) },
            { label: 'Start Time', value: formatDateTime(report.startTime) },
            { label: 'End Time', value: formatDateTime(report.endTime) },
            { label: 'Environment', value: report.environment },
            { label: 'Org ID', value: report.orgId },
            { label: 'Scope', value: report.scope.join(', ') },
            { label: 'Runtime Enrichment', value: report.runtimeEnrichment ? 'Enabled' : 'Disabled' },
            { label: 'Report Version', value: report.reportVersion },
            { label: 'Status', value: report.status },
          ].map((item) => (
            <div key={item.label}>
              <div style={labelStyle}>{item.label}</div>
              <div style={{ ...metaValueStyle, wordBreak: 'break-all' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Finding Card sub-component ─── */

function FindingCard({ cluster }: { cluster: Cluster }) {
  const friendlyName = FRIENDLY_NAMES[cluster.name] || cluster.name;
  const friendlyAction = FRIENDLY_RECOMMENDATIONS[cluster.recommendation] || cluster.recommendation;
  const priorityColor = PRIORITY_COLORS[cluster.runtimePriority] || '#969492';
  const linesNumber = extractLinesNumber(cluster.estimatedReduction);

  return (
    <div
      className="sf-card"
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: priorityColor,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--sf-text)' }}>
            {friendlyName}
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--sf-text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {cluster.memberCount} implementations
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--sf-text-secondary)', lineHeight: 1.5 }}>
        <strong>Keep:</strong> {cluster.preferredCandidate}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}
      >
        <span
          className={`recommendation-badge ${cluster.recommendation.toLowerCase().replace(' ', '-')}`}
          style={{ textTransform: 'none', fontWeight: 600, fontSize: 11 }}
        >
          {friendlyAction}
        </span>
        <span style={{ fontSize: 12, color: 'var(--sf-text-muted)' }}>
          ~{linesNumber} lines saveable
        </span>
      </div>
    </div>
  );
}
