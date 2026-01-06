import React, { useState } from 'react';
import { PageHeader } from '../components/brand/PageHeader';
import { Card } from '../components/brand/Card';
import { Button } from '../components/brand/Button';
import { Badge } from '../components/brand/Badge';
import { Github, Gitlab, Cloud, CheckCircle, XCircle } from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    status: 'connected' | 'disconnected' | 'error';
    connectedAt?: string;
}

export const IntegrationsPage: React.FC = () => {
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: 'github',
            name: 'GitHub',
            description: 'Connect your GitHub repositories to sync incidents and code contexts.',
            icon: Github,
            status: 'connected',
            connectedAt: '2023-12-01T10:00:00Z'
        },
        {
            id: 'gitlab',
            name: 'GitLab',
            description: 'Sync issues and merge requests from your GitLab projects.',
            icon: Gitlab, // Lucide doesn't have GitLab specific, using a placeholder if needed or just text. Actually Lucide DOES have Gitlab.
            status: 'disconnected'
        },
        {
            id: 'azure',
            name: 'Azure DevOps',
            description: 'Integrate with Azure Repos and Boards for seamless enterprise tracking.',
            icon: Cloud,
            status: 'disconnected'
        }
    ]);

    const handleConnect = (id: string) => {
        // Mock connection
        setIntegrations(prev => prev.map(int =>
            int.id === id ? { ...int, status: 'connected', connectedAt: new Date().toISOString() } : int
        ));
    };

    const handleDisconnect = (id: string) => {
        // Mock disconnection
        setIntegrations(prev => prev.map(int =>
            int.id === id ? { ...int, status: 'disconnected', connectedAt: undefined } : int
        ));
    };

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
            <PageHeader
                title="Integrations"
                description="Manage your connections to external code repositories and issue trackers."
                actions={
                    <Button variant="secondary">
                        Documentation
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                    <Card key={integration.id} className="flex flex-col h-full border-gray-200">
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <integration.icon className="w-8 h-8 text-gray-700" />
                                </div>
                                <Badge variant={integration.status === 'connected' ? 'success' : 'neutral'}>
                                    {integration.status === 'connected' ? 'Active' : 'Not Connected'}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                    {integration.description}
                                </p>
                            </div>

                            {integration.status === 'connected' && (
                                <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Syncing active since {new Date(integration.connectedAt!).toLocaleDateString()}</span>
                                </div>
                            )}

                            {integration.status === 'error' && (
                                <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                                    <XCircle className="w-4 h-4" />
                                    <span>Connection Error</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                            {integration.status === 'connected' ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDisconnect(integration.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleConnect(integration.id)}
                                >
                                    Connect {integration.name}
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
