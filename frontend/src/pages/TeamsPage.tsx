// Minimal design for TeamsPage
import { Users } from 'lucide-react';

export const TeamsPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teams</h1>
                <p className="text-gray-500 mt-2">Manage your team members and permissions.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        Waitlist
                    </h2>
                    <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                        Invite Member
                    </button>
                </div>
                <div className="p-12 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Team Management Coming Soon</h3>
                    <p className="max-w-md mx-auto mt-2">We are currently in early access. Team management features will be available in the next release.</p>
                </div>
            </div>
        </div>
    );
};
