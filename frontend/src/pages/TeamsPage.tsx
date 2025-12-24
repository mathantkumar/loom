
import { Avatar } from '../components/ui/Avatar';

export function TeamsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Teams & Ownership</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'SRE Core', members: 4, focus: 'Platform Reliability' },
                    { name: 'Product Engineering', members: 12, focus: 'Feature Development' },
                    { name: 'Data Infrastructure', members: 6, focus: 'Pipelines & Storage' },
                    { name: 'Security', members: 3, focus: 'Compliance & Safety' },
                ].map((team, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-gray-900">{team.name}</h2>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{team.members} members</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">{team.focus}</p>

                        <div className="flex -space-x-2 overflow-hidden">
                            <Avatar name="Alice" size="sm" className="ring-2 ring-white" />
                            <Avatar name="Bob" size="sm" className="ring-2 ring-white" />
                            <Avatar name="Charlie" size="sm" className="ring-2 ring-white" />
                            <div className="flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-gray-100 text-xs text-gray-500 font-medium">
                                +1
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
