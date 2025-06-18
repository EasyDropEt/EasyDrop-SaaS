'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useIntegration } from '@/hooks/useIntegration';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function IntegrationPage() {
  const {
    webhook,
    apiKeys,
    loading,
    error,
    newlyCreatedApiKey,
    createWebhook,
    createApiKey,
    deleteApiKey,
    clearNewApiKey
  } = useIntegration();

  const [webhookUrl, setWebhookUrl] = useState<string>(webhook?.url || '');
  const [apiKeyName, setApiKeyName] = useState<string>('');
  const [apiKeyDescription, setApiKeyDescription] = useState<string>('');
  const [creatingWebhook, setCreatingWebhook] = useState<boolean>(false);
  const [creatingKey, setCreatingKey] = useState<boolean>(false);
  const [keyPendingDelete, setKeyPendingDelete] = useState<{ name?: string; prefix: string } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Update input when webhook data changes
  useEffect(() => {
    if (webhook?.url) {
      setWebhookUrl(webhook.url);
    }
  }, [webhook]);

  const handleSaveWebhook = async () => {
    if (!webhookUrl) return;
    try {
      setCreatingWebhook(true);
      await createWebhook({ url: webhookUrl });
    } finally {
      setCreatingWebhook(false);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      setCreatingKey(true);
      if (!apiKeyName || !apiKeyDescription) return;
      await createApiKey({ name: apiKeyName, description: apiKeyDescription });
      setApiKeyName('');
      setApiKeyDescription('');
    } finally {
      setCreatingKey(false);
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto py-12 px-4"
      >
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Integration</h1>
          <p className="text-dark-600 dark:text-light-400">
            Configure webhooks and manage API keys for third-party integrations.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <PulseLoader color="#6366F1" size={12} />
          </div>
        ) : error ? (
          <motion.div
            variants={fadeInUp}
            className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8"
          >
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Webhook Section */}
            <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Webhook</h2>
              <p className="text-dark-600 dark:text-light-400 mb-6">
                Provide a URL to receive real-time event notifications.
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                  type="url"
                  placeholder="https://example.com/webhook"
                  className="flex-1 px-4 py-2 border border-light-300 dark:border-dark-600 rounded-md bg-light-100 dark:bg-dark-700 text-dark-900 dark:text-light-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <button
                  onClick={handleSaveWebhook}
                  disabled={creatingWebhook}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-60"
                >
                  {creatingWebhook ? 'Saving...' : webhook ? 'Update' : 'Create'}
                </button>
              </div>
              {webhook && (
                <p className="text-sm text-dark-500 dark:text-light-400 mt-3">
                  Current webhook: <span className="font-mono break-all">{webhook.url}</span>
                </p>
              )}
            </motion.div>

            {/* API Keys Section */}
            <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">API Keys</h2>
              <p className="text-dark-600 dark:text-light-400 mb-6">
                Generate and manage API keys to authenticate your requests.
              </p>

              {/* Create key */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Key name"
                  value={apiKeyName}
                  onChange={(e) => setApiKeyName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-light-300 dark:border-dark-600 rounded-md bg-light-100 dark:bg-dark-700 text-dark-900 dark:text-light-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Purpose / description"
                  value={apiKeyDescription}
                  onChange={(e) => setApiKeyDescription(e.target.value)}
                  className="flex-1 px-4 py-2 border border-light-300 dark:border-dark-600 rounded-md bg-light-100 dark:bg-dark-700 text-dark-900 dark:text-light-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleCreateApiKey}
                  disabled={creatingKey}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-60"
                >
                  {creatingKey ? 'Generating...' : 'Generate Key'}
                </button>
              </div>

              {/* Newly generated key modal */}
              {(newlyCreatedApiKey?.api_key || newlyCreatedApiKey?.key) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                  <div className="relative bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-lg p-8">
                    {/* Close button */}
                    <button
                      onClick={clearNewApiKey}
                      className="absolute top-4 right-4 text-dark-500 hover:text-dark-700 dark:text-light-400 dark:hover:text-white"
                      aria-label="Close"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="flex items-center justify-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-600/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.306 0 2.417-.835 2.83-2H17a1 1 0 100-2h-2.17A3.001 3.001 0 0012 5a3 3 0 00-2.83 2H7a1 1 0 100 2h2.17A3.001 3.001 0 0012 11z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13a7 7 0 0114 0v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5z" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-dark-900 dark:text-white text-center mb-4">New API Key</h3>
                    <p className="text-dark-600 dark:text-light-400 text-center mb-6">Copy and store this key securely. <br className="hidden sm:block"/>You won't be able to view it again.</p>

                    <div className="flex items-center gap-2 mb-8">
                      <code className="flex-1 font-mono break-all bg-light-100 dark:bg-dark-700 px-4 py-3 rounded-md text-sm text-dark-900 dark:text-light-50 select-all">
                        {newlyCreatedApiKey.api_key ?? newlyCreatedApiKey.key}
                      </code>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText((newlyCreatedApiKey.api_key ?? newlyCreatedApiKey.key) ?? '');
                            toast.success('Copied');
                          } catch {
                            toast.error('Failed');
                          }
                        }}
                        className="shrink-0 px-4 py-3 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={clearNewApiKey}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-sm"
                      >
                        I have copied it
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Keys table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-dark-800 divide-y divide-light-300 dark:divide-dark-600">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-dark-700 dark:text-light-300">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-dark-700 dark:text-light-300">Description</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-dark-700 dark:text-light-300">Status</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-300 dark:divide-dark-600">
                    {apiKeys.filter((key) => !key.name?.includes('Temporary API key created by system')).map((key) => (
                      <tr key={key.api_key_prefix}>
                        <td className="px-4 py-2 text-dark-900 dark:text-white">
                          {key.name ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-dark-600 dark:text-light-400 whitespace-pre-line">
                          {key.description ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-dark-600 dark:text-light-400 capitalize">
                          {key.status ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => setKeyPendingDelete({ name: key.name, prefix: (key as any).api_key_prefix ?? (key as any).prefix })}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {apiKeys.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-dark-600 dark:text-light-400">
                          No API keys found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      {keyPendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Delete API Key</h3>
            <p className="text-dark-600 dark:text-light-400 mb-6">
              Are you sure you want to delete the API key <span className="font-semibold">{keyPendingDelete.name || keyPendingDelete.prefix}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setKeyPendingDelete(null)}
                className="px-4 py-2 rounded-md bg-light-200 dark:bg-dark-700 text-dark-900 dark:text-light-200 hover:bg-light-300 dark:hover:bg-dark-600"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await deleteApiKey(keyPendingDelete.prefix);
                    setKeyPendingDelete(null);
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 