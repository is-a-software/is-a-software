  'use client';

  import { useEffect, useMemo, useRef, useState } from 'react';
  import Link from 'next/link';
  import { Fragment } from 'react';
  import { useRouter } from 'next/navigation';
  import Navbar from '@/components/Navbar';
  import Footer from '@/components/Footer';
  import ErrorBanner from '@/components/ErrorBanner';
  import ProtectedPageLoader from '@/components/ProtectedPageLoader';
  import RecordLimitSummary, { getLimitTone } from '@/components/RecordLimitSummary';
  import StatsGrid from '@/components/dashboard/StatsGrid';
  import DeleteConfirmModal from '@/components/dashboard/DeleteConfirmModal';
  import { domainApi } from '@/lib/api';
  import { logout } from '@/lib/auth';
  import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
  import { useAccountLimits } from '@/lib/hooks/useAccountLimits';
  import { useUnauthorizedRedirect } from '@/lib/hooks/useUnauthorizedRedirect';

  function normalizeDomains(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.domains)) return payload.domains;
    return [];
  }

  function normalizeRecords(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.records)) return payload.records;
    return [];
  }

  function getDomainLabel(domain) {
    return domain?.subdomain || domain?.name || 'unnamed';
  }

  function getRecordHostname(recordName, domainLabel) {
    if (!recordName || recordName === '@') {
      return `${domainLabel}.is-a.software`;
    }

    return `${recordName}.${domainLabel}.is-a.software`;
  }

  const BASE_RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'TXT'];
  const PREMIUM_RECORD_TYPES = ['MX', 'NS'];

  export default function Dashboard() {
    const router = useRouter();
    const handleUnauthorized = useUnauthorizedRedirect();
    const { isAuthed, isCheckingAuth } = useRequireAuth();

    const [isPageLoading, setIsPageLoading] = useState(true);

    const [domains, setDomains] = useState([]);
    const [allRecords, setAllRecords] = useState([]);
    const [isRecordsLoading, setIsRecordsLoading] = useState(false);
    const {
      limits,
      refreshLimits,
      setLimits
    } = useAccountLimits({
      enabled: false,
      onUnauthorized: handleUnauthorized
    });

    const [showNewDomain, setShowNewDomain] = useState(false);
    const [showNewRecord, setShowNewRecord] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [recordForm, setRecordForm] = useState({
      domainId: '',
      name: '@',
      type: 'A',
      value: '',
      ttl: 300
    });

    const [isCreatingDomain, setIsCreatingDomain] = useState(false);
    const [isDeletingDomainId, setIsDeletingDomainId] = useState(null);
    const [isCreatingRecord, setIsCreatingRecord] = useState(false);
    const [isDeletingRecordId, setIsDeletingRecordId] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editForm, setEditForm] = useState({ type: 'A', value: '', ttl: 300 });
    const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const infoTimerRef = useRef(null);

    useEffect(() => {
      if (info) {
        if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
        infoTimerRef.current = setTimeout(() => setInfo(''), 5000);
      }
      return () => {
        if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
      };
    }, [info]);

    const domainNameMap = useMemo(
      () => Object.fromEntries(domains.map((domain) => [String(domain.id), getDomainLabel(domain)])),
      [domains]
    );
    const availableRecordTypes = useMemo(
      () => (limits.premium ? [...BASE_RECORD_TYPES, ...PREMIUM_RECORD_TYPES] : BASE_RECORD_TYPES),
      [limits.premium]
    );

    const loadAllRecords = async (domainList) => {
      if (!domainList.length) {
        setAllRecords([]);
        return;
      }

      setIsRecordsLoading(true);
      try {
        const allResponses = await Promise.all(
          domainList.map(async (domain) => {
            const response = await domainApi.getDomainRecords(domain.id);
            const normalized = normalizeRecords(response);
            return normalized.map((record) => ({
              ...record,
              domainId: record.domainId ?? domain.id
            }));
          })
        );

        setAllRecords(allResponses.flat());
      } finally {
        setIsRecordsLoading(false);
      }
    };

    const loadDashboard = async () => {
      try {
        setError('');
        const [domainRes, limitsRes] = await Promise.all([
          domainApi.getDomains(),
          refreshLimits()
        ]);

        const loadedDomains = normalizeDomains(domainRes);
        setDomains(loadedDomains);
        setLimits(limitsRes);

        setRecordForm((prev) => ({
          ...prev,
          domainId: prev.domainId || String(loadedDomains[0]?.id || '')
        }));

        await loadAllRecords(loadedDomains);
      } catch (err) {
        if (err.status === 401) {
          logout();
          router.replace('/signin');
          return;
        }
        setError({ message: err.message || 'Failed to load dashboard data.', status: err.status });
      } finally {
        setIsPageLoading(false);
      }
    };

    useEffect(() => {
      if (!isAuthed) return;
      loadDashboard();
    }, [isAuthed]);

    useEffect(() => {
      if (limits.premium) return;

      const fallbackType = (type) => (PREMIUM_RECORD_TYPES.includes(type) ? 'A' : type);
      setRecordForm((prev) => (prev.type !== fallbackType(prev.type) ? { ...prev, type: fallbackType(prev.type) } : prev));
      setEditForm((prev) => (prev.type !== fallbackType(prev.type) ? { ...prev, type: fallbackType(prev.type) } : prev));
    }, [limits.premium]);

    const lastUpdated = useMemo(() => {
      const domainDates = domains
        .map((domain) => new Date(domain.createdAt || domain.updatedAt || Date.now()).getTime())
        .filter(Boolean);
      if (domainDates.length === 0) return 'Just now';
      return new Date(Math.max(...domainDates)).toLocaleString();
    }, [domains]);

    const clearMessages = () => {
      setError('');
      setInfo('');
    };

    const handleAddDomain = async (e) => {
      e.preventDefault();
      clearMessages();

      const cleaned = newDomain.trim().toLowerCase();
      const isValid = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/.test(cleaned);

      if (!cleaned) {
        setError('Enter a subdomain name first.');
        return;
      }

      if (!isValid) {
        setError('Use 3-63 chars: lowercase letters, numbers, hyphens; cannot start/end with hyphen.');
        return;
      }

      if (domains.some((domain) => getDomainLabel(domain) === cleaned)) {
        setError('This domain already exists in your dashboard list.');
        return;
      }

      setIsCreatingDomain(true);
      try {
        await domainApi.createDomain(cleaned);
        await loadDashboard();
        setInfo(`${cleaned}.is-a.software created successfully.`);
        setNewDomain('');
        setShowNewDomain(false);
      } catch (err) {
        if (err.status === 401) {
          logout();
          router.replace('/signin');
          return;
        }
        setError({ message: err.message || 'Failed to create domain.', status: err.status });
      } finally {
        setIsCreatingDomain(false);
      }
    };

    const handleCreateRecord = async (e) => {
      e.preventDefault();
      clearMessages();

      if (!recordForm.domainId) {
        setError('Select a domain first.');
        return;
      }

      if (!recordForm.value.trim()) {
        setError('Record value is required.');
        return;
      }

      setIsCreatingRecord(true);
      try {
        await domainApi.createRecord(recordForm.domainId, {
          name: recordForm.name.trim() || '@',
          type: recordForm.type,
          value: recordForm.value.trim(),
          ttl: Number(recordForm.ttl) || 300
        });

        await loadAllRecords(domains);
        await refreshLimits();

        setRecordForm((prev) => ({ ...prev, name: '@', type: 'A', value: '', ttl: 300 }));
        setShowNewRecord(false);
        setInfo('DNS record created successfully.');
      } catch (err) {
        if (err.status === 401) {
          logout();
          router.replace('/signin');
          return;
        }
        setError({ message: err.message || 'Failed to create DNS record.', status: err.status });
      } finally {
        setIsCreatingRecord(false);
      }
    };

    const requestDeleteDomain = (domain) => {
      setPendingDelete({
        type: 'domain',
        id: domain.id,
        label: `${getDomainLabel(domain)}.is-a.software`
      });
    };

    const requestDeleteRecord = (record) => {
      const domainLabel = domainNameMap[String(record.domainId)] || 'unknown';
      setPendingDelete({
        type: 'record',
        id: record.id,
        label: `${record.name} (${record.type}) on ${domainLabel}.is-a.software`
      });
    };

    const openEditRecord = (record) => {
      setEditingRecord(record);
      setEditForm({ type: record.type, value: record.value, ttl: record.ttl });
      clearMessages();
    };

    const handleUpdateRecord = async (e) => {
      e.preventDefault();
      if (!editingRecord) return;
      clearMessages();
      setIsUpdatingRecord(true);
      try {
        const updated = await domainApi.updateRecord(editingRecord.id, {
          type: editForm.type,
          value: editForm.value,
          ttl: Number(editForm.ttl)
        });
        setAllRecords((prev) => prev.map((r) => (r.id === editingRecord.id ? { ...r, ...updated } : r)));
        setEditingRecord(null);
        setInfo('DNS record updated successfully.');
      } catch (err) {
        if (err.status === 401) {
          logout();
          router.replace('/signin');
          return;
        }
        setError({ message: err.message || 'Failed to update DNS record.', status: err.status });
      } finally {
        setIsUpdatingRecord(false);
      }
    };

    const handleDeleteDomain = async ({ id, label }) => {
      clearMessages();
      setIsDeletingDomainId(id);
      try {
        await domainApi.deleteDomain(id);
        await loadDashboard();
        setInfo(`${label} and its records were deleted.`);
      } catch (err) {
        if (err.status === 401) {
          logout();
          router.replace('/signin');
          return;
        }
        setError({ message: err.message || 'Failed to delete domain.', status: err.status });
      } finally {
        setIsDeletingDomainId(null);
        setPendingDelete(null);
      }
    };

    const handleDeleteRecord = async ({ id }) => {
      clearMessages();
      setIsDeletingRecordId(id);
      try {
        await domainApi.deleteRecord(id);
        setAllRecords((prev) => prev.filter((record) => record.id !== id));
        await refreshLimits();
        setInfo('Record deleted successfully.');
      } catch (err) {
        if (err.status === 401) {
          logout();
          router.replace('/signin');
          return;
        }
        setError({ message: err.message || 'Failed to delete DNS record.', status: err.status });
      } finally {
        setIsDeletingRecordId(null);
        setPendingDelete(null);
      }
    };

    const confirmDelete = async () => {
      if (!pendingDelete) return;
      if (pendingDelete.type === 'domain') {
        await handleDeleteDomain(pendingDelete);
        return;
      }
      await handleDeleteRecord(pendingDelete);
    };

    if (isCheckingAuth || !isAuthed || isPageLoading) {
      return <ProtectedPageLoader message="Loading dashboard..." />;
    }

    const limitTone = getLimitTone(limits.recordsUsed, limits.recordLimit);

    return (
      <>
        <Navbar />
        <div className="min-h-screen px-4 pt-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-300">Manage your subdomains</p>
            </div>

            <StatsGrid
              domainsCount={domains.length}
              recordsUsed={limits.recordsUsed}
              recordLimit={limits.recordLimit}
              lastUpdated={lastUpdated}
            />

            <ErrorBanner error={error} status={typeof error === 'object' ? error.status : undefined} />
            {!error && info && (
              <div className="glass border border-white/10 p-4 text-sm status-good">{info}</div>
            )}

            {/* Usage nudge — shown when approaching or at limit */}
            {!error && limits.recordLimit > 0 && (limitTone === 'warning' || limitTone === 'danger') && (
              <div
                className="glass rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm"
                style={{
                  border: limitTone === 'danger'
                    ? '1px solid rgba(248,113,113,0.3)'
                    : '1px solid rgba(251,191,36,0.25)'
                }}
              >
                <div className="w-full">
                  <RecordLimitSummary limits={limits} showActions compact />
                </div>
              </div>
            )}

            {/* Domains Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Your Domains</h2>
                <button
                  onClick={() => setShowNewDomain(!showNewDomain)}
                  className="btn-primary text-sm"
                >
                  {showNewDomain ? 'Close' : '+ Add Domain'}
                </button>
              </div>

              {showNewDomain && (
                <form onSubmit={handleAddDomain} className="glass p-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="newDomain" className="block text-sm font-medium text-slate-200">
                      New Subdomain
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="newDomain"
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
                        placeholder="mynewproject"
                        className="input-glass flex-1"
                      />
                      <span className="domain-suffix">
                        .is-a.software
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1" disabled={isCreatingDomain}>
                      {isCreatingDomain ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewDomain(false)}
                      className="btn-secondary flex-1"
                      disabled={isCreatingDomain}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {domains.length === 0 ? (
                <div className="glass p-12 text-center space-y-4">
                  <p className="text-slate-400">No domains yet</p>
                  <p className="text-sm text-slate-500">
                    Create your first subdomain to start managing DNS records.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {domains.map(domain => (
                    <div
                      key={domain.id}
                      className="glass p-4 w-full text-left flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-white">{getDomainLabel(domain)}.is-a.software</h3>
                        <p className="text-sm text-slate-400">
                          Created: {new Date(domain.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="status-pill px-3 py-1 text-xs rounded-full">
                          {domain.status || 'active'}
                        </span>
                        <button
                          type="button"
                          onClick={() => requestDeleteDomain(domain)}
                          className="danger-soft text-xs"
                          disabled={isDeletingDomainId === domain.id}
                        >
                          {isDeletingDomainId === domain.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">DNS Records</h2>
                <button
                  onClick={() => setShowNewRecord(!showNewRecord)}
                  className="btn-primary text-sm"
                  disabled={domains.length === 0}
                >
                  {showNewRecord ? 'Close' : '+ Add Record'}
                </button>
              </div>

              {showNewRecord && (
                <form onSubmit={handleCreateRecord} className="glass p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm text-slate-200">Domain</label>
                      <select
                        className="input-glass"
                        value={recordForm.domainId}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, domainId: e.target.value }))}
                        required
                      >
                        <option value="" disabled>Select domain</option>
                        {domains.map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {getDomainLabel(domain)}.is-a.software
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-slate-200">Name</label>
                      <input
                        className="input-glass"
                        value={recordForm.name}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="@"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm text-slate-200">Type</label>
                      <select
                        className="input-glass"
                        value={recordForm.type}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, type: e.target.value }))}
                      >
                        {availableRecordTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {!limits.premium && (
                        <p className="text-xs text-slate-500">MX and NS records are available on Premium.</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm text-slate-200">Value</label>
                      <input
                        className="input-glass"
                        value={recordForm.value}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, value: e.target.value }))}
                        placeholder="1.2.3.4"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm text-slate-200">TTL</label>
                      <input
                        type="number"
                        min="60"
                        className="input-glass"
                        value={recordForm.ttl}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, ttl: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-primary flex-1" disabled={isCreatingRecord}>
                      {isCreatingRecord ? 'Creating...' : 'Create Record'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary flex-1"
                      onClick={() => setShowNewRecord(false)}
                      disabled={isCreatingRecord}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {isRecordsLoading ? (
                <div className="glass p-6 text-slate-400">Loading DNS records...</div>
              ) : allRecords.length === 0 ? (
                <div className="glass p-6 text-slate-400">No DNS records found across your domains.</div>
              ) : (
                <div className="glass overflow-x-auto">
                  <table className="w-full min-w-180 text-sm">
                    <thead>
                      <tr className="border-b divider text-left">
                        <th className="px-4 py-3 text-slate-400 font-medium">Name</th>
                        <th className="px-4 py-3 text-slate-400 font-medium">Type</th>
                        <th className="px-4 py-3 text-slate-400 font-medium">Value</th>
                        <th className="px-4 py-3 text-slate-400 font-medium">TTL</th>
                        <th className="px-4 py-3 text-slate-400 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allRecords.map((record) => (
                        <Fragment key={record.id}>
                          <tr className="border-b divider/50">
                            {(() => {
                              const domainLabel = domainNameMap[String(record.domainId)] || 'unknown';
                              const fullHostname = getRecordHostname(record.name, domainLabel);

                              return (
                                <>
                                  <td className="px-4 py-3 text-white break-all">{fullHostname}</td>
                                  <td className="px-4 py-3 text-slate-200">{record.type}</td>
                                  <td className="px-4 py-3 text-slate-300 break-all">{record.value}</td>
                                  <td className="px-4 py-3 text-slate-400">{record.ttl}</td>
                                </>
                              );
                            })()}
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => editingRecord?.id === record.id ? setEditingRecord(null) : openEditRecord(record)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                  disabled={isDeletingRecordId === record.id}
                                  title="Edit record"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestDeleteRecord(record)}
                                  className="danger-soft text-sm"
                                  disabled={isDeletingRecordId === record.id}
                                >
                                  {isDeletingRecordId === record.id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editingRecord?.id === record.id && (
                            <tr className="bg-white/5">
                              <td colSpan={5} className="px-4 py-4">
                                <form onSubmit={handleUpdateRecord} className="flex flex-wrap items-end gap-3">
                                  <div className="space-y-1 min-w-22.5">
                                    <label className="block text-xs text-slate-400">Type</label>
                                    <select
                                      className="input-glass text-sm py-1.5"
                                      value={editForm.type}
                                      onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}
                                    >
                                      {availableRecordTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="space-y-1 flex-1 min-w-40">
                                    <label className="block text-xs text-slate-400">Value</label>
                                    <input
                                      className="input-glass text-sm py-1.5"
                                      value={editForm.value}
                                      onChange={(e) => setEditForm((prev) => ({ ...prev, value: e.target.value }))}
                                      placeholder="1.2.3.4"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-1 w-22.5">
                                    <label className="block text-xs text-slate-400">TTL</label>
                                    <input
                                      type="number"
                                      min="60"
                                      className="input-glass text-sm py-1.5"
                                      value={editForm.ttl}
                                      onChange={(e) => setEditForm((prev) => ({ ...prev, ttl: e.target.value }))}
                                      required
                                    />
                                  </div>
                                  <div className="flex gap-2 pb-0.5">
                                    <button type="submit" className="btn-primary text-sm py-1.5 px-3" disabled={isUpdatingRecord}>
                                      {isUpdatingRecord ? 'Saving...' : 'Save'}
                                    </button>
                                    <button type="button" className="btn-secondary text-sm py-1.5 px-3" onClick={() => setEditingRecord(null)} disabled={isUpdatingRecord}>
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>

        <Footer />

        <DeleteConfirmModal
          pendingDelete={pendingDelete}
          isDeleting={!!isDeletingDomainId || !!isDeletingRecordId}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      </>
    );
  }
