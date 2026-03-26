import { useState } from 'react';
import {
  BarChart3,
  ExternalLink,
  Download,
  RotateCcw,
  Plus,
  Loader2,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { scanReports } from '../data/mockData';

interface CodeReusabilityLandingProps {
  onViewReport: (reportId: string) => void;
  onGenerateReport: () => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const statusBadgeClass: Record<string, string> = {
  Complete: 'sf-badge sf-badge-complete',
  'In Progress': 'sf-badge sf-badge-progress',
  Failed: 'sf-badge sf-badge-failed',
  Draft: 'sf-badge sf-badge-draft',
};

export default function CodeReusabilityLanding({
  onViewReport,
  onGenerateReport,
}: CodeReusabilityLandingProps) {
  const { scanInProgress, processingMessage, triggerScan, showToast } = useAppContext();

  const [reportName, setReportName] = useState(
    'Mar 2026 Code Reuse Report - Northstar Retail Group',
  );
  const [environment, setEnvironment] = useState('Production');
  const [scope, setScope] = useState('All Surfaces');

  const handleGenerate = () => {
    triggerScan();
    onGenerateReport();
  };

  const handleDownloadPdf = (reportName: string) => {
    showToast('Preparing PDF...', 'info');
    setTimeout(() => {
      showToast('PDF downloaded successfully', 'success');
    }, 1500);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="sf-breadcrumb">
        <a href="#" onClick={(e) => e.preventDefault()}>SETUP</a>
        <span className="sep">›</span>
        <a href="#" onClick={(e) => e.preventDefault()}>CODE INTELLIGENCE</a>
        <span className="sep">›</span>
        <span>CODE REUSABILITY</span>
      </div>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #e1f5fe, #bbdefb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BarChart3 size={20} color="#0176d3" />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Code Reusability</h1>
          <p style={{ fontSize: 13, color: 'var(--sf-text-secondary)', marginTop: 2 }}>
            Scan your org to find repeated code patterns and identify opportunities to simplify your codebase.
          </p>
        </div>
      </div>

      {/* New Report card */}
      <div className="sf-card" style={{ marginBottom: 20, position: 'relative' }}>
        <h2 className="sf-section-title">New Report</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 200px 200px',
            gap: 12,
            alignItems: 'end',
            marginBottom: 16,
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--sf-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBottom: 6,
              }}
            >
              Report Name
            </label>
            <input
              className="sf-input"
              style={{ width: '100%' }}
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              disabled={scanInProgress}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--sf-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBottom: 6,
              }}
            >
              Environment
            </label>
            <select
              className="sf-select"
              style={{ width: '100%' }}
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              disabled={scanInProgress}
            >
              <option>Production</option>
              <option>Full Copy Sandbox</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--sf-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBottom: 6,
              }}
            >
              Scope
            </label>
            <select
              className="sf-select"
              style={{ width: '100%' }}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              disabled={scanInProgress}
            >
              <option>All Surfaces</option>
              <option>Apex Only</option>
              <option>Apex + Triggers</option>
            </select>
          </div>
        </div>

        <button
          className="sf-btn sf-btn-primary"
          onClick={handleGenerate}
          disabled={scanInProgress}
        >
          Generate Report
        </button>

        {/* Scan progress overlay */}
        {scanInProgress && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.82)',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              zIndex: 10,
            }}
          >
            <Loader2
              size={28}
              color="var(--sf-blue)"
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--sf-text)',
              }}
            >
              {processingMessage}
            </span>
          </div>
        )}
      </div>

      {/* Recent Reports card */}
      <div className="sf-card" style={{ padding: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid var(--sf-border)',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent Reports</h2>
          <button
            className="sf-btn sf-btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Plus size={14} />
            New Report
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="sf-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Requestor</th>
                <th>Requested Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Score</th>
                <th>Delta</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scanReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    {report.status === 'Complete' ? (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onViewReport(report.id);
                        }}
                        style={{
                          color: 'var(--sf-blue)',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.textDecoration = 'underline')
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.textDecoration = 'none')
                        }
                      >
                        {report.name}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 500 }}>{report.name}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--sf-text-secondary)' }}>{report.requestedBy}</td>
                  <td style={{ color: 'var(--sf-text-secondary)' }}>
                    {formatDate(report.requestedDate)}
                  </td>
                  <td style={{ color: 'var(--sf-text-secondary)', fontSize: 12 }}>
                    {formatDateTime(report.startTime)}
                  </td>
                  <td style={{ color: 'var(--sf-text-secondary)', fontSize: 12 }}>
                    {formatDateTime(report.endTime)}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>
                      {report.score !== null ? report.score : '—'}
                    </span>
                  </td>
                  <td>
                    {report.scoreDelta !== null ? (
                      <span style={{ color: 'var(--sf-success)', fontWeight: 600 }}>
                        +{report.scoreDelta}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--sf-text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={statusBadgeClass[report.status] || 'sf-badge'}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'flex-end',
                      }}
                    >
                      {report.status === 'Complete' && (
                        <button
                          className="sf-btn sf-btn-icon sf-btn-sm"
                          title="View Report"
                          onClick={() => onViewReport(report.id)}
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                      <button
                        className="sf-btn sf-btn-icon sf-btn-sm"
                        title="Download PDF"
                        onClick={() => handleDownloadPdf(report.name)}
                      >
                        <Download size={14} />
                      </button>
                      {report.status === 'Failed' && (
                        <button
                          className="sf-btn sf-btn-icon sf-btn-sm"
                          title="Re-run"
                          onClick={handleGenerate}
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
