import React from 'react';

export interface DocSection {
    id: string;
    title: string;
    category: string;
    content: React.ReactNode;
}

export const DOCS: DocSection[] = [
    {
        id: 'introduction',
        title: 'Introduction',
        category: 'Getting Started',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Sentinel</h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Sentinel is an <strong>AI-native Incident Intelligence Platform</strong> designed for modern engineering teams.
                    Unlike traditional ticketing systems that just track data, Sentinel actively helps you resolve incidents faster
                    by correlating deployments, detecting anomaly patterns, and drafting root cause analyses.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                    <h3 className="text-blue-900 font-semibold mb-2">Why Sentinel?</h3>
                    <p className="text-blue-800">
                        We built Sentinel because context switching kills resolution time. By bringing CI/CD signals,
                        metrics, and AI analysis into one view, we help SREs and Developers close tickets in minutes, not hours.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Philosophy</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li><strong>Intelligence First:</strong> Every incident should come with context, not just a title.</li>
                        <li><strong>Human-in-the-Loop:</strong> AI suggests, you decide. Agents draft actions but never execute without approval.</li>
                        <li><strong>Zero Clutter:</strong> Minimalist, high-density UI designed for power users.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'getting-started',
        title: 'Getting Started',
        category: 'Getting Started',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
                <p className="text-lg text-gray-700">
                    Learn the basics of navigating Sentinel and managing your first incident.
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">The INCLO ID</h2>
                    <p className="text-gray-700 mb-4">
                        Every incident in Sentinel is assigned a unique, human-readable identifier formatted as
                        <code className="bg-gray-100 px-2 py-1 rounded mx-1 text-sm font-mono font-medium">INCLO-XXXX</code>
                        (e.g., INCLO-1042). This ID is used for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>URL Routing (e.g., <code>/incidents/INCLO-1042</code>)</li>
                        <li>Git Commit correlation (referencing the ID in commits links them automatically)</li>
                        <li>Communication in Slack/Teams</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Your First Incident</h2>
                    <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                        <li>Click the <span className="font-semibold text-blue-600">Create New Incident</span> button on the top right of the dashboard.</li>
                        <li>Fill in the <strong>Title</strong> (keep it concise, e.g., "Checkout API Latency Spike").</li>
                        <li>Select the affected <strong>Service</strong> and <strong>Severity</strong> (SEV1-SEV4).</li>
                        <li>Add an initial description. Don't worry about being perfect; AI will help you refine it later.</li>
                    </ol>
                </section>
            </div>
        )
    },
    {
        id: 'incident-lifecycle',
        title: 'Incident Lifecycle',
        category: 'Core Concepts',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Incident Lifecycle</h1>
                <p className="text-lg text-gray-700">
                    Understanding the stages of an incident in Sentinel helps teams align on progress.
                </p>

                <div className="grid gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">OPEN</span>
                        </div>
                        <p className="text-gray-600">The incident has been reported but not yet assigned or triaged. AI is attempting to analyze correlation.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">INVESTIGATING</span>
                        </div>
                        <p className="text-gray-600">An engineer is actively looking into the issue. Evidence is being gathered.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">MITIGATED</span>
                        </div>
                        <p className="text-gray-600">The immediate bleeding has stopped, but the root cause may not be fixed.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">RESOLVED</span>
                        </div>
                        <p className="text-gray-600">The issue is fixed and systems are stable.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ai-features',
        title: 'AI Features Explained',
        category: 'Core Concepts',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">AI Features</h1>
                <p className="text-lg text-gray-700">
                    Sentinel's "Brain" runs in the background to augment your investigation.
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">"What Happened?" Analysis</h2>
                    <p className="text-gray-700 mb-4">
                        On the Incident Detail page, you can click <strong>Analyze</strong> to trigger a baseline deviation check.
                        Sentinel compares current metrics against historical baselines to identify anomalies.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h4 className="font-semibold text-sm text-gray-500 uppercase">Example Output</h4>
                        <p className="font-mono text-sm mt-2 text-gray-800">
                            "Latency deviation detected (3.4σ). Correlates with deployment <span className="text-blue-600">payment-service-v23</span> deployed 14 mins ago."
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Incident Detection</h2>
                    <p className="text-gray-700">
                        Using semantic vector search, Sentinel finds past incidents that "mean" the same thing as your current issue, even if they use different words. This helps you find previous solutions instantly.
                    </p>
                </section>
            </div>
        )
    },
    {
        id: 'agent-actions',
        title: 'Agent Actions',
        category: 'Features',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Agent Actions</h1>
                <p className="text-lg text-gray-700">
                    Sentinel Agents can perform tasks on your behalf, reducing toil.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-800">
                        <strong>Note:</strong> Agents utilize a "Human-in-the-Loop" validation model. They will draft emails,
                        write summaries, or propose queries, but they require your click to execute or send.
                    </p>
                </div>
                <section>
                    <h2 className="text-xl font-bold mt-6 mb-2">Available Actions</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li><strong>Draft Email Update:</strong> Generates a formatted executive summary for stakeholders.</li>
                        <li><strong>Summarize Ticket:</strong> Condenses long thread discussions into a bulleted list.</li>
                        <li><strong>Check Anomaly Trends:</strong> On-demand scan of time-series data.</li>
                    </ul>
                </section>
            </div>
        )
    },
    {
        id: 'cicd-integration',
        title: 'CI/CD Integration',
        category: 'Integration',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">CI/CD Integration</h1>
                <p className="text-lg text-gray-700">
                    Most incidents are caused by change. Sentinel correlates incidents directly to recent deployments.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Deployment Correlation</h2>
                    <p className="text-gray-700">
                        When an incident is created for a service (e.g., <code>cart-service</code>), Sentinel looks back at the
                        last 2 hours of deployment history for that service in the same environment.
                    </p>
                    <p className="mt-2 text-gray-700">
                        If a match is found, it is displayed in the <strong>Deployment Context</strong> card on the incident page, showing:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                        <li>Commit Hash & Message</li>
                        <li>Author</li>
                        <li>Deployment Time</li>
                    </ul>
                </section>
            </div>
        )
    },
    {
        id: 'stats-history',
        title: 'Stats & History',
        category: 'Insights',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Stats & Metrics</h1>
                <p className="text-lg text-gray-700">
                    Navigate to the <strong>Stats</strong> page to view team health metrics.
                </p>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border p-4 rounded">
                        <h3 className="font-bold text-gray-900">MTTR (Mean Time To Resolution)</h3>
                        <p className="text-sm text-gray-600 mt-1">Average time from creation to resolution. Lower is better.</p>
                    </div>
                    <div className="border p-4 rounded">
                        <h3 className="font-bold text-gray-900">Engineer Load</h3>
                        <p className="text-sm text-gray-600 mt-1">Number of active incidents per engineer. Helps prevent burnout.</p>
                    </div>
                </section>
            </div>
        )
    },
    {
        id: 'chatops-integration',
        title: 'ChatOps Integration',
        category: 'Integration',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">ChatOps Integration</h1>
                <p className="text-lg text-gray-700">
                    Sentinel meets you where you work—in Slack or Microsoft Teams.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Slack Integration</h2>
                    <p className="text-gray-700 mb-4">
                        Connect Sentinel to Slack to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Receive alerts in specific channels via <strong>@Sentinel</strong> bot.</li>
                        <li>Update incident status directly from Slack threads.</li>
                        <li>Sync Slack discussions back to the incident timeline automatically.</li>
                    </ul>
                    <div className="mt-4 bg-gray-100 p-3 rounded-md font-mono text-sm text-gray-800">
                        /loom incident create [title]<br />
                        /loom status [INCLO-ID]
                    </div>
                </section>
            </div>
        )
    },
    {
        id: 'postmortems',
        title: 'Postmortems',
        category: 'Insights',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Postmortems</h1>
                <p className="text-lg text-gray-700">
                    Learning from failure is how we build resilience.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Auto-Generation</h2>
                    <p className="text-gray-700">
                        Once an incident is marked <strong>RESOLVED</strong>, Sentinel can draft a postmortem template for you containing:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
                        <li><strong>Timeline:</strong> Auto-reconstructed from events.</li>
                        <li><strong>Root Cause:</strong> Based on the AI analysis and final resolution notes.</li>
                        <li><strong>Impact Analysis:</strong> Duration and affected services.</li>
                    </ul>
                </section>
            </div>
        )
    },
    {
        id: 'teams-ownership',
        title: 'Teams & Ownership',
        category: 'Platform',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Teams & Ownership</h1>
                <p className="text-lg text-gray-700">
                    Define clear ownership to ensure every alert has a responder.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Ownership</h2>
                    <p className="text-gray-700">
                        Map services (e.g., <code>auth-service</code>) to specific Teams (e.g., "Platform Security").
                        This ensures that when an alert fires for that service, the correct on-call rotation is paged.
                    </p>
                </section>
            </div>
        )
    },
    {
        id: 'best-practices',
        title: 'Best Practices',
        category: 'Platform',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Best Practices</h1>
                <p className="text-lg text-gray-700">
                    Running effective incidents is a skill. Here is how to do it well with Sentinel.
                </p>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Declare Early</h3>
                    <p className="text-gray-700 mb-4">
                        Don't wait until you are sure. If something looks wrong, open an incident. It's better to close a false alarm than to delay response to a real outage.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Use the Timeline</h3>
                    <p className="text-gray-700 mb-4">
                        Document key decisions in the timeline manually if they happen offline (e.g., "Called vendor support"). This builds a rich history for the postmortem.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Trust but Verify AI</h3>
                    <p className="text-gray-700">
                        Sentinel's AI helps fast-forward investigation, but you are the pilot. Always validate the "What Happened" analysis against your own observability tools.
                    </p>
                </section>
            </div>
        )
    },
    {
        id: 'faq',
        title: 'FAQ',
        category: 'Support',
        content: (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-900">Is the AI analysis always correct?</h3>
                        <p className="text-gray-700">No. AI provides probabilistic suggestions based on your data. Always verify suggested root causes before taking action on production systems.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Can I use Loom strictly for tracking?</h3>
                        <p className="text-gray-700">Yes, you can ignore the AI features and use Sentinel as a high-speed, minimalist ticketing system.</p>
                    </div>
                </div>
            </div>
        )
    }
];
