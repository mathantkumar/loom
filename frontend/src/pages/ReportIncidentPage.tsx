

export function ReportIncidentPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Incident</h1>
            <p className="text-gray-500 mb-8">
                Please provide as much detail as possible. This will trigger paging for the on-call engineer.
            </p>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title</label>
                        <input type="text" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border" placeholder="e.g., Payment Gateway High Latency" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                            <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border">
                                <option>Select a service...</option>
                                <option>API Gateway</option>
                                <option>Database</option>
                                <option>Frontend</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border">
                                <option>SEV3 (Minor)</option>
                                <option>SEV2 (Major)</option>
                                <option>SEV1 (Critical)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows={4} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border" placeholder="Describe the impact and current symptoms..."></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="button" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Trigger Incident
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
